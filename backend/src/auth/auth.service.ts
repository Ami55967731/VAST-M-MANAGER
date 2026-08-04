import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { BaseService } from 'src/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseProvider } from 'src/database/database.provider';
import { LoginDto, SignUp, ChangePasswordDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto, VerifyOtpDto, } from './dto';
import { compare, hash } from 'bcrypt';
import { JWTPayload } from './auth.interface';
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';
import { EmailService } from 'src/common/email/email.service';


@Injectable()
export class AuthService extends BaseService {
  constructor(
    private prisma: DatabaseProvider,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {
    super();
  }

  async signJWT(payload: any) {
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = uuidv4();

    await this.storeRefreshToken(refreshToken, payload.userId);

    return this.Results({ accessToken, refreshToken });
  }

  async verifyJWT(jwt: string) {
    try {
      const user: JWTPayload = this.jwtService.verify(jwt);
      return this.Results(user);
    } catch (error) {
      if (error.message.includes('expired')) {
        return this.HandleError(
          new UnauthorizedException('Token Expired! Please Sign in.'),
        );
      }
      if (error.message.includes('invalid')) {
        return this.HandleError(
          new UnauthorizedException('Invalid Token! Please Sign in.'),
        );
      }
      throw error;
    }
  }

  async signUp(payload: SignUp) {
    const { firstName, lastName, email, password, avatar } = payload;

    const existingUser = await this.prisma.user.findFirst({
      where:
        { email }
    })
    if (existingUser) {
      return this.HandleError(
        new ConflictException('User with this email already exists')
      )
    }

    const newUser = await this.prisma.user.create({
      data: {
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: await hash(password, 10),
        avatar: avatar || ''
      }
    });

    const jwtPayload: JWTPayload = {
      email: newUser.email,
      lastLoggedInAt: new Date().toISOString(),
      userId: newUser.id,
    }

    const { data: accessToken } = await this.signJWT(jwtPayload);

    return this.Results({ user: newUser, accessToken });
  }

  async login(payload: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: payload.email }
    });

    if (!user) {
      return this.HandleError(
        new UnauthorizedException('Incorrect Credentials')
      );
    }

    if (!(await compare(payload.password, user.password))) {
      return this.HandleError(
        new UnauthorizedException('Incorrect Credentials')
      )
    }

    const jwtPayload: JWTPayload = {
      email: user.email,
      lastLoggedInAt: new Date().toISOString(),
      userId: user.id,
    }

    const { data: accessToken } = await this.signJWT(jwtPayload);
    return this.Results({ user, accessToken });
  }

  async refreshTokens(payload: RefreshTokenDto) {
    const { token } = payload;

    const refreshToken = await this.prisma.refreshToken.findFirst({
      where: {
        token,
        expiryDate: { gte: new Date() }
      }
    });

    if (!refreshToken) {
      return this.HandleError(
        new UnauthorizedException('Invalid Refresh Token')
      );
    }

    const user = await this.prisma.user.findFirst({
      where: { id: refreshToken.userId }
    });

    if (!user) {
      return this.HandleError(
        new UnauthorizedException('User not found')
      );
    }

    const jwtPayload: JWTPayload = {
      email: user.email,
      lastLoggedInAt: new Date().toISOString(),
      userId: user.id,
    }
    const newToken = await this.signJWT(jwtPayload);

    return this.Results(newToken);
  }

  // async validateUser(email: string, password: string) {
  //   const user = await this.prisma.user.findUnique({
  //     where: { email }
  //   });

  //   if (!user) {
  //     return this.HandleError(
  //       new NotFoundException('User with this email not found')
  //     );
  //   }

  //   const isPasswordValid = await compare(password, user.password);
  //   if (!isPasswordValid) {
  //     return this.HandleError(
  //       new UnauthorizedException('Invalid Credentials')
  //     );
  //   }

  //   return this.Results(user);
  // }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return this.HandleError(
          new NotFoundException('User with this email not found')
        );
      }

      const isPasswordValid = await compare(password, user.password);
      if (!isPasswordValid) {
        return this.HandleError(
          new UnauthorizedException('Invalid Credentials')
        );
      }

      return this.Results(user);
    } catch (error) {
      return this.HandleError(error);
    }
  }

  async verifyOtp(payload: VerifyOtpDto) {
  const user = await this.prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    return this.HandleError(
      new NotFoundException("User not found"),
    );
  }

  const otp = await this.prisma.otpCode.findFirst({
    where: {
      userId: user.id,
      code: payload.code,
      verified: false,
      expiryDate: {
        gte: new Date(),
      },
    },
  });

  if (!otp) {
    return this.HandleError(
      new UnauthorizedException(
        "Invalid or expired OTP",
      ),
    );
  }

  await this.prisma.otpCode.update({
    where: {
      id: otp.id,
    },
    data: {
      verified: true,
    },
  });

  const resetToken = nanoid(64);

  await this.prisma.resetToken.create({
    data: {
      token: resetToken,
      userId: user.id,
      expiryDate: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  return this.Results({
    resetToken,
  });
}

  async storeRefreshToken(token: string, userId: string) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);

    await this.prisma.refreshToken.upsert({
      where: { userId },
      update: {
        token,
        expiryDate
      },
      create: {
        token,
        userId,
        expiryDate
      }
    });
  }

  async changePassword(userId: string, payload: ChangePasswordDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return this.HandleError(
        new NotFoundException('User not found')
      );
    }

    const isPasswordValid = await compare(payload.oldPassword, existingUser.password);
    if (!isPasswordValid) {
      return this.HandleError(
        new UnauthorizedException('Invalid Credentials')
      );
    }

    const newPassword = await hash(payload.newPassword, 10);

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { password: newPassword }
    });

    return this.Results(user);
  }

async forgotPassword(payload: ForgotPasswordDto) {
  const user = await this.prisma.user.findUnique({
    where: { email: payload.email },
  });

  // Don't reveal whether the email exists
  if (!user) {
    return this.Results(null);
  }

  // Generate a 6-digit OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // OTP expires in 10 minutes
  const expiryDate = new Date(Date.now() + 10 * 60 * 1000);

  // Delete any previous OTPs for this user
  await this.prisma.otpCode.deleteMany({
    where: {
      userId: user.id,
    },
  });

  // Save the new OTP
  await this.prisma.otpCode.create({
    data: {
      userId: user.id,
      code,
      expiryDate,
    },
  });

  // Send OTP by email
  await this.emailService.sendOtpEmail(
    user.email,
    code,
  );

  return this.Results(null);
}

  async resetPassword(payload: ResetPasswordDto) {
    const token = await this.prisma.resetToken.findFirst({
      where: {
        token: payload.resetToken,
        expiryDate: { gte: new Date() }
      }
    });

    if (!token) {
      return this.HandleError(
        new UnauthorizedException('Invalid or expired token')
      );
    }

    await this.prisma.resetToken.delete({
      where: { token: token.token }
    });

    const existingUser = await this.prisma.user.findUnique({
      where: { id: token.userId }
    });
    if (!existingUser) {
      return this.HandleError(
        new NotFoundException('User not found')
      );
    }

    const newPassword = await hash(payload.newPassword, 10);

    const user = await this.prisma.user.update({
      where: { id: existingUser.id },
      data: { password: newPassword }
    });

    return this.Results(user);

  }
}

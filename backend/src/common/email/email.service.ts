import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { config } from '../config';
import { createTransport } from 'nodemailer';
import * as nodemailer from 'nodemailer/lib/mailer';

@Injectable()
export class EmailService extends BaseService {
    private transporter: nodemailer.Transporter;

    constructor() {
        super();
        this.transporter = createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: config.MAIL_USERNAME,
                pass: config.MAIL_PASSWORD,
                clientId: config.OAUTH_CLIENTID,
                clientSecret: config.OAUTH_CLIENT_SECRET,
                refreshToken: config.OAUTH_REFRESH_TOKEN
            }
        });
        // this.transporter = nodemailer.createTransport({
        //     host: 'smtp.etheral.email',
        //     port: 587,
        //     auth: {
        //         user: 'kaylin.mraz@ethereal.email',
        //         pass: 'V9817m1958'
        //     },
        // });
    }

   async sendOtpEmail(email: string, otp: string) {
  const mailOptions = {
    from: "Vast Manager",
    to: email,
    subject: "Password Reset OTP",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Password Reset</h2>

        <p>Use the OTP below to reset your password.</p>

        <h1
          style="
            letter-spacing:8px;
            color:#1789FC;
            font-size:36px;
          "
        >
          ${otp}
        </h1>

        <p>
          This code expires in
          <strong>10 minutes</strong>.
        </p>

        <p>
          If you didn't request this,
          ignore this email.
        </p>
      </div>
    `,
  };

  await this.transporter.sendMail(mailOptions);
}
}
// constructor(
//     private prisma: DatabaseProvider,
//     private jwtService: JwtService
// ) {
//     super();
//     this.nodemailerTransport = createTransport({
//         service: 'gmail',
//         auth: {
//             type: 'OAuth2',
//             user: config.MAIL_USERNAME,
//             pass: config.MAIL_PASSWORD,
//             clientId: config.OAUTH_CLIENTID,
//             clientSecret: config.OAUTH_CLIENT_SECRET,
//             refreshToken: config.OAUTH_REFRESH_TOKEN
//         }
//         // host: 'smtp.gmail.com',
//         // port: 465,
//         // secure: true,
//         // auth: {
//         //     user: config.EMAIL_USER,
//         //     pass: config.EMAIL_PASSWORD
//         // }
//     })
// }

// private sendMail(options: Mail.Options) {
//     console.log('Email sent out to', options.to);
//     return this.nodemailerTransport.sendMail(options);
// }

// public async sendResetPasswordLink(email: string) {
//     const payload = { email };

//     const token = this.jwtService.sign(payload, {
//         secret: process.env.JWT_SECRET,
//         expiresIn: '1h',
//     });

//     const user = await this.prisma.user.findUnique({
//         where: { email },
//     });
//     if (!user) {
//         return this.HandleError(
//             new NotFoundException('User with this email not found')
//         );
//     }
//     // user.resetToken = token;


//     const url = `${config.EMAIL_RESET_PASSWORD_URL}?token=${token}`;

//     const text = `Hi, \nTo reset your password, click here: ${url}`;

//     return this.sendMail({
//         to: email,
//         subject: 'Reset password',
//         text
//     });

// }

// public async decodeConfirmationToken(token: string) {
//     const payload = await this.jwtService.verify(token, {
//         secret: config.JWT_VERIFICATION_TOKEN_SECRET
//     });

//     if (typeof payload === 'object' && 'email' in payload) {
//         return payload.email;
//     }
//     return this.HandleError(new BadRequestException());
// }

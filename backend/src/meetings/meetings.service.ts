import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Status } from "@prisma/client";

import { BaseService } from "src/common";
import { DatabaseProvider } from "src/database/database.provider";
import { NotificationGateway } from "src/notification/notification.gateway";

import {
  CreateMeetingDto,
  SetStatusDto,
  UpdateMeetingDto,
} from "./dtos";

@Injectable()
export class MeetingsService extends BaseService {
  constructor(
    private readonly prisma: DatabaseProvider,
    private readonly notificationGateway: NotificationGateway,
  ) {
    super();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
async setMeetingStatus() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  await this.prisma.meeting.updateMany({
    where: {
      startTime: {
        gte: today,
        lt: tomorrow,
      },
      status: Status.UPCOMING,
    },
    data: {
      status: Status.TODAY,
    },
  });

  await this.prisma.meeting.updateMany({
    where: {
      date: {
        lt: today,
      },
      status: {
        in: [Status.UPCOMING, Status.TODAY],
      },
    },
    data: {
      status: Status.COMPLETED,
    },
  });

  const todayMeetings = await this.prisma.meeting.findMany({
    where: {
      status: Status.TODAY,
      startTime: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  for (const meeting of todayMeetings) {
    this.notificationGateway.sendNotification(null, this.createMeetingNotification(
      meeting,
      "Meeting reminder",
      `You have a meeting today: ${meeting.title}`,
      "system",
    ));
  }

  return this.Results({
    message: "Meeting statuses updated successfully",
  });
}
private resolveMeetingStatus(meetingDate: Date, startTimeDate: Date) {
  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const normalizedMeetingDate = new Date(
    meetingDate.getFullYear(),
    meetingDate.getMonth(),
    meetingDate.getDate(),
  );

  if (normalizedMeetingDate < today) {
    return Status.COMPLETED;
  }

  if (
    normalizedMeetingDate.getTime() === today.getTime() &&
    startTimeDate.getTime() >= now.getTime()
  ) {
    return Status.TODAY;
  }

  return Status.UPCOMING;
}

private async findMeeting(userId: string, id: string) {
  return this.prisma.meeting.findFirst({
    where: {
      id,
      userId,
    },
  });
}

private async ensureMeetingExists(userId: string, id: string) {
  const meeting = await this.findMeeting(userId, id);

  if (!meeting) {
    throw new NotFoundException("Meeting not found");
  }

  return meeting;
}

  async getAllMeetings(
    userId: string,
    query: Record<string, unknown> = {},
    status?: Status,
    {
      pageSize = 10,
      page = 1,
    }: {
      pageSize?: number;
      page?: number;
    } = {},
  ) {
    const take = Number(pageSize);
    const skip = (Number(page) - 1) * take;

    const whereClause = {
      userId,
      ...query,
      ...(status ? { status } : {}),
    };

    const [meetings, total] = await Promise.all([
      this.prisma.meeting.findMany({
        where: whereClause,
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
      }),

      this.prisma.meeting.count({
        where: whereClause,
      }),
    ]);

    return this.Results({
      meetings,
     metaData: {
      page: Number(page),
      pageSize: Number(pageSize),
     total,
     },
     });
  }

  async getMeetingById(userId: string, id: string) {
  const meeting = await this.ensureMeetingExists(userId, id);

  return this.Results(meeting);
}

async createMeeting(
  userId: string,
  payload: CreateMeetingDto,
) {
  const {
    title,
    description,
    startTime,
    date,
    duration,
    ...createDetails
  } = payload;

  const [year, month, day] = date.split("-").map(Number);
  const meetingDate = new Date(year, month - 1, day);
  const startTimeDate = new Date(startTime);

  if (Number.isNaN(meetingDate.getTime()) || Number.isNaN(startTimeDate.getTime())) {
    return this.HandleError(
      new BadRequestException("Please provide a valid meeting date and time"),
    );
  }

const now = new Date();

if (startTimeDate < now) {
  return this.HandleError(
    new BadRequestException(
      "Meeting time cannot be in the past",
    ),
  );
 }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const meetingDay = new Date(meetingDate);
  meetingDay.setHours(0, 0, 0, 0);

  if (meetingDay < today) {
    return this.HandleError(
      new BadRequestException(
        "Meeting date cannot be in the past",
      ),
    );
  }

  const status = this.resolveMeetingStatus(meetingDate, startTimeDate);
  const endTime = new Date(
    startTimeDate.getTime() + duration * 60 * 1000,
  );

  const meeting = await this.prisma.meeting.create({
    data: {
      title,
      description,
      startTime: startTimeDate,
      endTime,
      date: meetingDate,
      userId,
      status,
      ...createDetails,
    },
  });

  if (status === Status.TODAY) {
    this.notificationGateway.sendNotification(null, this.createMeetingNotification(
      meeting,
      "Meeting created",
      `${meeting.title} is scheduled for today.`,
      "meeting-created",
    ));
  } else {
    this.notificationGateway.sendNotification(null, this.createMeetingNotification(
      meeting,
      "Meeting created",
      `${meeting.title} was added to your meetings.`,
      "meeting-created",
    ));
  }

  return this.Results(meeting);
}

async updateMeeting(
  userId: string,
  id: string,
  payload: UpdateMeetingDto,
) {
 const meeting = await this.ensureMeetingExists(userId, id);

  if (meeting.status === Status.COMPLETED) {
    return this.HandleError(
      new BadRequestException("Completed meetings cannot be edited"),
    );
  }

  const {
    title,
    description,
    timezone,
    location,
    isRecurring,
    date,
    startTime,
    duration,
    ...rest
  } = payload;

const updateData: Record<string, unknown> = {
  ...rest,
};

  if (title !== undefined) {
    updateData.title = title;
  }

  if (description !== undefined) {
    updateData.description = description;
  }

  if (timezone !== undefined) {
    updateData.timezone = timezone;
  }

  if (location !== undefined) {
    updateData.location = location;
  }

  if (isRecurring !== undefined) {
    updateData.isRecurring = isRecurring;
  }

  if (date) {
    updateData.date = new Date(date);
  }

  if (startTime) {
    const startTimeDate = new Date(startTime);

    updateData.startTime = startTimeDate;

    const meetingDuration =
      duration ??
      Math.floor(
        (meeting.endTime.getTime() - meeting.startTime.getTime()) /
          (60 * 1000),
      );

    updateData.endTime = new Date(
      startTimeDate.getTime() + meetingDuration * 60 * 1000,
    );
  } else if (duration) {
    updateData.endTime = new Date(
      meeting.startTime.getTime() + duration * 60 * 1000,
    );
  }

  if (updateData.date || updateData.startTime) {
    const resolvedDate = updateData.date as Date | undefined;
    const resolvedStartTime = updateData.startTime as Date | undefined;

    updateData.status = this.resolveMeetingStatus(
      resolvedDate ?? meeting.date,
      resolvedStartTime ?? meeting.startTime,
    );
  }

  const updatedMeeting = await this.prisma.meeting.update({
    where: {
      id,
    },
    data: updateData,
  });

  this.notificationGateway.sendNotification(null, this.createMeetingNotification(
    updatedMeeting,
    "Meeting updated",
    `${updatedMeeting.title} was updated successfully.`,
    "meeting-updated",
  ));

  return this.Results(updatedMeeting);
}

private createMeetingNotification(
  meeting: { id: string; title: string },
  title: string,
  message: string,
  type: "meeting-created" | "meeting-updated" | "system",
) {
  return {
    id: meeting.id,
    sender: "Vast Meeting Manager",
    title,
    message,
    meetingId: meeting.id,
    createdAt: new Date().toISOString(),
    isRead: false,
    type,
  };
}

async deleteMeeting(userId: string, id: string) {
 const meeting = await this.ensureMeetingExists(userId, id);

  if (meeting.status === Status.COMPLETED) {
    return this.HandleError(
      new BadRequestException("Completed meetings cannot be deleted"),
    );
  }

  await this.prisma.meeting.delete({
    where: {
      id,
    },
  });

  return this.Results(null);
}

async userSetMeetingStatus(
  userId: string,
  id: string,
  payload: SetStatusDto,
) {
 await this.ensureMeetingExists(userId, id);

  const updatedMeeting = await this.prisma.meeting.update({
    where: {
      id,
    },
    data: {
      status: payload.status,
    },
  });

  return this.Results(updatedMeeting);
}
}


import { Module } from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { MeetingsController } from './meetings.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationModule } from 'src/notification/notification.module';
import { NotificationGateway } from 'src/notification/notification.gateway';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    NotificationModule,
  ],
  providers: [MeetingsService],
  controllers: [MeetingsController]
})
export class MeetingsModule { }

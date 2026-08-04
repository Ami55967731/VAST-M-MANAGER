import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationGateway } from './notification.gateway';

@Module({
  providers: [NotificationGateway],
  controllers: [NotificationController],
  exports: [NotificationGateway],
})
export class NotificationModule { }

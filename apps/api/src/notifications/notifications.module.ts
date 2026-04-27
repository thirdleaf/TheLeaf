import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationService } from './notification.service';


@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationService, NotificationsGateway],
  exports: [NotificationsService, NotificationService, NotificationsGateway],
})
export class NotificationsModule {}

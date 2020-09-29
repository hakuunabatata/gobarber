import { ObjectID } from 'mongodb'

import NotificationsRepository from '@modules/notifications/repositories/NotificationsRepository'
import CreateNotificationDTO from '@modules/notifications/dtos/CreateNotificationDTO'

import Notification from '../../infra/typeorm/schemas/Notification'

class NotificationRepository implements NotificationsRepository {
  private notifications: Notification[] = []

  public async create({
    content,
    recipient_id,
  }: CreateNotificationDTO): Promise<Notification> {
    const notification = new Notification()

    Object.assign(notification, { id: new ObjectID(), content, recipient_id })

    await this.notifications.push(notification)

    return notification
  }
}

export default NotificationRepository

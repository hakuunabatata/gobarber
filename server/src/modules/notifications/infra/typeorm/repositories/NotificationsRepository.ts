import { getMongoRepository, MongoRepository } from 'typeorm'

import NotificationsRepository from '@modules/notifications/repositories/NotificationsRepository'
import CreateNotificationDTO from '@modules/notifications/dtos/CreateNotificationDTO'

import Notification from '../schemas/Notification'

class NotificationRepository implements NotificationsRepository {
  private ormRepository: MongoRepository<Notification>

  constructor() {
    this.ormRepository = getMongoRepository(Notification, 'mongo')
  }

  public async create({
    content,
    recipient_id,
  }: CreateNotificationDTO): Promise<Notification> {
    const notification = this.ormRepository.create({
      content,
      recipient_id,
    })

    await this.ormRepository.save(notification)

    return notification
  }
}

export default NotificationRepository

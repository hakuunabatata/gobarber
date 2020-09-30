import { startOfHour, isBefore, getHours, format } from 'date-fns'
import { injectable, inject } from 'tsyringe'

import Appointment from '../infra/typeorm/entities/Appointment'

import AppError from '@shared/errors/AppError'
import AppointmentRepository from '../repositories/AppointmentRepository'
import NotificationsRepository from '../../notifications/repositories/NotificationsRepository'
import CacheProvider from '@shared/container/providers/CacheProvider/models/CacheProvider'

interface Request {
  provider_id: string
  user_id: string
  date: Date
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: AppointmentRepository,

    @inject('NotificationsRepository')
    private notificationRepository: NotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: CacheProvider,
  ) {}

  public async execute({
    date,
    provider_id,
    user_id,
  }: Request): Promise<Appointment> {
    const appointmentDate = startOfHour(date)

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError(`You can't create an appointment on a past date`)
    }

    if (user_id === provider_id) {
      throw new AppError(
        `You can't create an appointment with you as the provider`,
      )
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17)
      throw new AppError(
        'You can only create appointments between 8am and 5pm ',
      )

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    )

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked')
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    })

    const formattedDate = format(appointmentDate, "dd/MM/yyyy 'as' HH:mm")

    await this.notificationRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para dia ${formattedDate}`,
    })

    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        'yyyy-M-d',
      )}`,
    )

    return appointment
  }
}

export default CreateAppointmentService

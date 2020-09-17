import { startOfHour } from 'date-fns'

import Appointment from '../infra/typeorm/entities/Appointment'

import AppError from '@shared/errors/AppError'
import AppointmentRepository from '../repositories/AppointmentRepository'

interface Request {
  provider_id: string
  date: Date
}

class CreateAppointmentService {
  constructor(private appointmentsRepository: AppointmentRepository) {}

  public async execute({ date, provider_id }: Request): Promise<Appointment> {
    const appointmentDate = startOfHour(date)

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    )

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked')
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    })

    return appointment
  }
}

export default CreateAppointmentService

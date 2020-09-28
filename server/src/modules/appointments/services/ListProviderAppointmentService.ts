import { injectable, inject } from 'tsyringe'
import Appointment from '../infra/typeorm/entities/Appointment'

import AppointmentRepository from '../repositories/AppointmentRepository'

interface Request {
  provider_id: string
  month: number
  year: number
  day: number
}

@injectable()
class ListProviderAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: AppointmentRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    day,
    year,
  }: Request): Promise<Appointment[]> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        day,
        month,
        year,
        provider_id,
      },
    )

    return appointments
  }
}

export default ListProviderAppointmentService

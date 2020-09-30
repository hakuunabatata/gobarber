import { injectable, inject } from 'tsyringe'
import Appointment from '../infra/typeorm/entities/Appointment'

import AppointmentRepository from '../repositories/AppointmentRepository'
import CacheProvider from '@shared/container/providers/CacheProvider/models/CacheProvider'

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

    @inject('CacheProvider')
    private cacheProvider: CacheProvider,
  ) {}

  public async execute({
    provider_id,
    month,
    day,
    year,
  }: Request): Promise<Appointment[]> {
    const cacheKey = `provider-appointments:${provider_id}-${year}-${month}-${day}`

    let appointments = await this.cacheProvider.recover<Appointment[]>(cacheKey)

    console.log(appointments)

    if (!appointments) {
      appointments = await this.appointmentsRepository.findAllInDayFromProvider(
        {
          day,
          month,
          year,
          provider_id,
        },
      )

      console.log('Buscou do banco')

      await this.cacheProvider.save(cacheKey, appointments)
    }

    return appointments
  }
}

export default ListProviderAppointmentService

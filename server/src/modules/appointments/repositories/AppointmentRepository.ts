import Appointment from '../infra/typeorm/entities/Appointment'
import CreateAppointmentDTO from '../dtos/CreateAppointmentDTO'
import FindAllInMonthFromProviderDTO from '../dtos/FindAllInMonthFromProviderDTO'
import FindAllInDayFromProviderDTO from '../dtos/FindAllInDayFromProviderDTO'

export default interface AppointmentRepository {
  create(data: CreateAppointmentDTO): Promise<Appointment>
  findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>
  findAllInMonthFromProvider(
    data: FindAllInMonthFromProviderDTO,
  ): Promise<Appointment[]>
  findAllInDayFromProvider(
    data: FindAllInDayFromProviderDTO,
  ): Promise<Appointment[]>
}

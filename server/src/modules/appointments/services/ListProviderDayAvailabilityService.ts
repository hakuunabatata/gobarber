import { injectable, inject } from 'tsyringe'
import { getHours, isAfter } from 'date-fns'

import AppointmentRepository from '../repositories/AppointmentRepository'

interface Request {
  provider_id: string
  month: number
  year: number
  day: number
}

type Response = Array<{
  hour: number
  available: boolean
}>

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: AppointmentRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
    day,
  }: Request): Promise<Response> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        provider_id,
        month,
        year,
        day,
      },
    )

    const hourStart = 8

    const eachHourArray = Array.from(
      {
        length: 10,
      },
      (_, index) => index + hourStart,
    )

    const currentDate = new Date(Date.now())

    const availability = eachHourArray.map(hour => {
      const hasAppointmentInHour = appointments.find(
        appointment => getHours(appointment.date) === hour,
      )

      const compareDate = new Date(year, month - 1, day, hour)

      return {
        hour,
        available: !hasAppointmentInHour && isAfter(compareDate, currentDate),
      }
    })

    return availability
  }
}

export default ListProviderMonthAvailabilityService

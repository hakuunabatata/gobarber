import { injectable, inject } from 'tsyringe'
import { getDaysInMonth, getDate, isAfter } from 'date-fns'

import AppointmentRepository from '../repositories/AppointmentRepository'

interface Request {
  provider_id: string
  month: number
  year: number
}

type Response = Array<{
  day: number
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
  }: Request): Promise<Response> {
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      {
        provider_id,
        month,
        year,
      },
    )

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1))

    const eachDayArray = Array.from(
      { length: numberOfDaysInMonth },
      (value, index) => index + 1,
    )

    const availability = eachDayArray.map(day => {
      const compareDate = new Date(year, month - 1, day, 23, 59, 59)

      const appointmentsinDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day
      })
      return {
        day,
        available:
          isAfter(compareDate, new Date()) && appointmentsinDay.length < 10,
      }
    })

    return availability
  }
}

export default ListProviderMonthAvailabilityService

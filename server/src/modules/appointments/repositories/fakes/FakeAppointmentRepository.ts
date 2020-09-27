import { uuid } from 'uuidv4'
import { isEqual, getMonth, getYear, getDate } from 'date-fns'

import AppointmentRepository from '@modules/appointments/repositories/AppointmentRepository'
import CreateAppointmentDTO from '@modules/appointments/dtos/CreateAppointmentDTO'
import FindAllInMonthFromProviderDTO from '@modules/appointments/dtos/FindAllInMonthFromProviderDTO'
import FindAllInDayFromProviderDTO from '@modules/appointments/dtos/FindAllInDayFromProviderDTO'

import Appointment from '../../infra/typeorm/entities/Appointment'

class FakeAppointmentsRepository implements AppointmentRepository {
  private appointments: Appointment[] = []

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(appointment =>
      isEqual(appointment.date, date),
    )

    return findAppointment
  }

  public async create({
    date,
    provider_id,
  }: CreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment()

    Object.assign(appointment, { id: uuid(), date, provider_id })

    this.appointments.push(appointment)

    return appointment
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: FindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(appointment => {
      return (
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year
      )
    })

    return appointments
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: FindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(appointment => {
      return (
        appointment.provider_id === provider_id &&
        getDate(appointment.date) === day &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year
      )
    })

    return appointments
  }
}

export default FakeAppointmentsRepository

import { uuid } from 'uuidv4'
import { isEqual } from 'date-fns'

import AppointmentRepository from '@modules/appointments/repositories/AppointmentRepository'
import CreateAppointmentDTO from '@modules/appointments/dtos/CreateAppointmentDTO'

import Appointment from '../../infra/typeorm/entities/Appointment'

class AppointmentsRepository implements AppointmentRepository {
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
}

export default AppointmentsRepository

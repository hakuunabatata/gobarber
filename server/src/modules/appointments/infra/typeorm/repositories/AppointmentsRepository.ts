import { getRepository, Repository, Raw } from 'typeorm'

import AppointmentRepository from '@modules/appointments/repositories/AppointmentRepository'
import CreateAppointmentDTO from '@modules/appointments/dtos/CreateAppointmentDTO'

import Appointment from '../entities/Appointment'
import FindAllInMonthFromProviderDTO from '@modules/appointments/dtos/FindAllInMonthFromProviderDTO'
import FindAllInDayFromProviderDTO from '@modules/appointments/dtos/FindAllInDayFromProviderDTO'
import { String } from 'aws-sdk/clients/batch'
import { string } from 'yup'

class AppointmentsRepository implements AppointmentRepository {
  private ormRepository: Repository<Appointment>

  constructor() {
    this.ormRepository = getRepository(Appointment)
  }

  public async findByDate(
    date: Date,
    provider_id: String,
  ): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date, provider_id },
    })

    return findAppointment
  }

  public async create({
    date,
    user_id,
    provider_id,
  }: CreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      provider_id,
      date,
      user_id,
    })

    await this.ormRepository.save(appointment)

    return appointment
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: FindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const parsedMonth = `${month < 10 ? '0' : ''}${month}`

    console.log(parsedMonth)

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY' ) = '${parsedMonth}-${year}'`,
        ),
      },
    })

    return appointments
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: FindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const parsedDay = `${day < 10 ? '0' : ''}${day}`
    const parsedMonth = `${month < 10 ? '0' : ''}${month}`

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY' ) = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
      relations: ['user'],
    })

    return appointments
  }
}

export default AppointmentsRepository

import AppError from '@shared/errors/AppError'
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentRepository'

import CreateAppointmentService from './CreateAppointmentService'

let fakeAppointmentRepository: FakeAppointmentsRepository
let CreateAppointment: CreateAppointmentService

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentsRepository()
    CreateAppointment = new CreateAppointmentService(fakeAppointmentRepository)
  })

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime()
    })

    const appointment = await CreateAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      provider_id: '123321',
      user_id: '123123',
    })

    expect(appointment).toHaveProperty('id')
    expect(appointment.provider_id).toBe('123321')
  })

  it('should not be able to create two appointments in the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime()
    })

    const appointmentDate = new Date(2020, 4, 10, 15)

    await CreateAppointment.execute({
      date: appointmentDate,
      provider_id: '123321',
      user_id: '123123',
    })

    await expect(
      CreateAppointment.execute({
        date: appointmentDate,
        provider_id: '123321',
        user_id: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime()
    })

    await expect(
      CreateAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        user_id: '123321',
        provider_id: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime()
    })

    await expect(
      CreateAppointment.execute({
        date: new Date(2020, 4, 10, 13),
        user_id: '123123',
        provider_id: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment before the start hour', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime()
    })

    await expect(
      CreateAppointment.execute({
        date: new Date(2020, 4, 11, 7),
        user_id: '123123',
        provider_id: '123321',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment after the final hour', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime()
    })

    await expect(
      CreateAppointment.execute({
        date: new Date(2020, 4, 10, 19),
        user_id: '123123',
        provider_id: '123321',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})

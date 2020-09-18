import AppError from '@shared/errors/AppError'
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentRepository'

import CreateAppointmentService from './CreateAppointmentService'

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentRepository = new FakeAppointmentsRepository()
    const CreateAppointment = new CreateAppointmentService(
      fakeAppointmentRepository,
    )

    const appointment = await CreateAppointment.execute({
      date: new Date(),
      provider_id: '123123',
    })

    expect(appointment).toHaveProperty('id')
    expect(appointment.provider_id).toBe('123123')
  })

  it('should not be able to create two appointments in the same time', async () => {
    const fakeAppointmentRepository = new FakeAppointmentsRepository()
    const CreateAppointment = new CreateAppointmentService(
      fakeAppointmentRepository,
    )

    const appointmentDate = new Date(2020, 4, 10, 11)

    const appointment = await CreateAppointment.execute({
      date: appointmentDate,
      provider_id: '123123',
    })

    expect(
      CreateAppointment.execute({
        date: appointmentDate,
        provider_id: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})

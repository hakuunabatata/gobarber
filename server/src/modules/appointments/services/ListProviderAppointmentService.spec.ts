import AppError from '@shared/errors/AppError'
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentRepository'

import ListProviderAppointmentService from './ListProviderAppointmentService'

let fakeAppointmentRepository: FakeAppointmentsRepository
let listProviderAppointments: ListProviderAppointmentService

describe('showProfile', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentsRepository()
    listProviderAppointments = new ListProviderAppointmentService(
      fakeAppointmentRepository,
    )
  })

  it('should be able to list the appointments on a specific day', async () => {
    const appointment1 = await fakeAppointmentRepository.create({
      user_id: 'user',
      provider_id: 'provider',
      date: new Date(2020, 10, 20, 11, 0, 0),
    })

    const appointment2 = await fakeAppointmentRepository.create({
      user_id: 'user',
      provider_id: 'provider',
      date: new Date(2020, 10, 20, 15, 0, 0),
    })

    const appointments = await listProviderAppointments.execute({
      provider_id: 'provider',
      year: 2020,
      month: 11,
      day: 20,
    })

    expect(appointments).toEqual([appointment1, appointment2])
  })
})

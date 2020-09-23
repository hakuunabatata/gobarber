import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '../repositories/fakes/FakeUserRepository'

import ShowProfileService from './ShowProfileService'

let fakeUserRepository: FakeUsersRepository
let showProfile: ShowProfileService

describe('showProfile', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository()
    showProfile = new ShowProfileService(fakeUserRepository)
  })

  it('should be able to show the profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'fulano@das.com',
      password: '123456',
    })

    const profile = await showProfile.execute({
      user_id: user.id,
    })

    expect(profile.name).toBe('John Doe')
    expect(profile.email).toBe('fulano@das.com')
  })

  it('should not be able to show the profile of non-existing user', async () => {
    expect(
      showProfile.execute({
        user_id: 'non-existing id',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})

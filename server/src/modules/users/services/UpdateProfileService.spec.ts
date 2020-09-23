import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '../repositories/fakes/FakeUserRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/fakeHashProvider'

import UpdateProfileService from './UpdateProfileService'

let fakeUserRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let updateProfile: UpdateProfileService

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()
    updateProfile = new UpdateProfileService(
      fakeUserRepository,
      fakeHashProvider,
    )
  })

  it('should be able to update profile infos', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'fulano@das.com',
      password: '123456',
    })

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Tre',
      email: 'ciclano@ads.com',
    })

    expect(updatedUser.name).toBe('John Tre')
    expect(updatedUser.email).toBe('ciclano@ads.com')
  })

  it('should not be able to update a non-existing profile', async () => {
    expect(
      updateProfile.execute({
        user_id: 'non-existing id',
        name: 'John Tre',
        email: 'ciclano@ads.com',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to change to another user email', async () => {
    await fakeUserRepository.create({
      name: 'John Doe',
      email: 'fulano@das.com',
      password: '123456',
    })

    const user = await fakeUserRepository.create({
      name: 'John Tre',
      email: 'ciclano@ads.com',
      password: '123456',
    })

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'fulano@das.com',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should be able to update the password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'fulano@das.com',
      password: '123456',
    })

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Tre',
      email: 'ciclano@ads.com',
      password: '123123',
      old_password: '123456',
    })
    expect(updatedUser.password).toBe('123123')
  })

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'fulano@das.com',
      password: '123456',
    })

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Tre',
        email: 'ciclano@ads.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'fulano@das.com',
      password: '123456',
    })

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Tre',
        email: 'ciclano@ads.com',
        old_password: 'wrong',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})

import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '../repositories/fakes/FakeUserRepository'
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider'

import UpdateUserAvatarService from './UpdateUserAvatarService'

let fakeUserRepository: FakeUsersRepository
let fakeStorageProvider: FakeStorageProvider
let updateUserAvatar: UpdateUserAvatarService

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository()
    fakeStorageProvider = new FakeStorageProvider()
    updateUserAvatar = new UpdateUserAvatarService(
      fakeUserRepository,
      fakeStorageProvider,
    )
  })

  it('should be able to update avatar', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'fulano@das.com',
      password: '123456',
    })

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'aang.png',
    })

    expect(user.avatar).toBe('aang.png')
  })

  it('should not be able to update avatar with a non-existent user', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'non-exists',
        avatarFilename: 'aang.png',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should delete old avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile')

    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'fulano@das.com',
      password: '123456',
    })

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'aang.png',
    })

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'korra.png',
    })

    expect(deleteFile).toHaveBeenCalledWith('aang.png')

    expect(user.avatar).toBe('korra.png')
  })
})

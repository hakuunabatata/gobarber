import AppError from '@shared/errors/AppError'
import FakeUsersRepository from '../repositories/fakes/FakeUserRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/fakeHashProvider'

import CreateUserService from './CreateUserService'

let fakeUserRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let CreateUser: CreateUserService

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()
    CreateUser = new CreateUserService(fakeUserRepository, fakeHashProvider)
  })

  it('should be able to create a new user', async () => {
    const user = await CreateUser.execute({
      name: 'John Doe',
      email: 'fulano@a.com',
      password: '1234565',
    })

    expect(user).toHaveProperty('id')
  })

  it('should not be able to create a user with duplicated email', async () => {
    await CreateUser.execute({
      name: 'John Doe',
      email: 'fulano@a.com',
      password: '1234565',
    })

    await expect(
      CreateUser.execute({
        name: 'John Doe',
        email: 'fulano@a.com',
        password: '1234565',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})

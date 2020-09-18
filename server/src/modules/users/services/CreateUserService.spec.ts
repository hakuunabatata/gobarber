import AppError from '@shared/errors/AppError'
import FakeUsersRepository from '../repositories/fakes/FakeUserRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/fakeHashProvider'

import CreateUserService from './CreateUserService'

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUserRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()
    const CreateUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    )

    const user = await CreateUser.execute({
      name: 'John Doe',
      email: 'fulano@a.com',
      password: '1234565',
    })

    expect(user).toHaveProperty('id')
  })

  it('should not be able to create a user with duplicated email', async () => {
    const fakeUserRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()

    const CreateUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    )

    await CreateUser.execute({
      name: 'John Doe',
      email: 'fulano@a.com',
      password: '1234565',
    })

    expect(
      CreateUser.execute({
        name: 'John Doe',
        email: 'fulano@a.com',
        password: '1234565',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})

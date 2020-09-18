import AppError from '@shared/errors/AppError'
import FakeUsersRepository from '../repositories/fakes/FakeUserRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/fakeHashProvider'

import AuthenticateUserService from './AuthenticateUserService'
import CreateUserService from './CreateUserService'

describe('AuthenticateUser', () => {
  it('should be able to authenticate', async () => {
    const fakeUserRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()

    const CreateUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    )

    const AuthenticateUser = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
    )

    const user = await CreateUser.execute({
      name: 'John Doe',
      email: 'fulano@a.com',
      password: '1234565',
    })

    const response = await AuthenticateUser.execute({
      email: 'fulano@a.com',
      password: '1234565',
    })

    expect(response).toHaveProperty('token')
    expect(response.user).toEqual(user)
  })

  it('should not be able to authenticate with non-existing user', async () => {
    const fakeUserRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()

    const AuthenticateUser = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
    )

    expect(
      AuthenticateUser.execute({
        email: 'fulano@a.com',
        password: '1234565',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const fakeUserRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()

    const CreateUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    )

    const AuthenticateUser = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
    )
    await CreateUser.execute({
      name: 'John Doe',
      email: 'fulano@a.com',
      password: '1234565',
    })

    expect(
      AuthenticateUser.execute({
        email: 'fulano@a.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})

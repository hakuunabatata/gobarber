import AppError from '@shared/errors/AppError'
import FakeUsersRepository from '../repositories/fakes/FakeUserRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/fakeHashProvider'

import AuthenticateUserService from './AuthenticateUserService'
import CreateUserService from './CreateUserService'

let fakeUserRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let CreateUser: CreateUserService
let AuthenticateUser: AuthenticateUserService

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()

    CreateUser = new CreateUserService(fakeUserRepository, fakeHashProvider)

    AuthenticateUser = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
    )
  })

  it('should be able to authenticate', async () => {
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
    await expect(
      AuthenticateUser.execute({
        email: 'fulano@a.com',
        password: '1234565',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await CreateUser.execute({
      name: 'John Doe',
      email: 'fulano@a.com',
      password: '1234565',
    })

    await expect(
      AuthenticateUser.execute({
        email: 'fulano@a.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})

import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUserRepository'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'

import ListProvidersService from './ListProvidersService'

let fakeUserRepository: FakeUsersRepository
let fakeCacheProvider: FakeCacheProvider
let listProviders: ListProvidersService

describe('showProfile', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository()
    fakeCacheProvider = new FakeCacheProvider()
    listProviders = new ListProvidersService(
      fakeUserRepository,
      fakeCacheProvider,
    )
  })

  it('should be able to list the providers', async () => {
    const user1 = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'fulano@das.com',
      password: '123456',
    })

    const user2 = await fakeUserRepository.create({
      name: 'John Tre',
      email: 'ciclano@das.com',
      password: '123456',
    })

    const loggedUser = await fakeUserRepository.create({
      name: 'John Qua',
      email: 'beltrano@das.com',
      password: '123456',
    })

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    })

    expect(providers).toEqual([user1, user2])
  })
})

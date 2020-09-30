import { inject, injectable } from 'tsyringe'
import User from '@modules/users/infra/typeorm/entities/Users'

import CacheProvider from '@shared/container/providers/CacheProvider/models/CacheProvider'
import AppError from '@shared/errors/AppError'
import UserRepository from '@modules/users/repositories/UserRepository'

interface Request {
  user_id: string
}

@injectable()
class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UserRepository,

    @inject('CacheProvider')
    private cacheProvider: CacheProvider,
  ) {}

  public async execute({ user_id }: Request): Promise<User[]> {
    let users = await this.cacheProvider.recover<User[]>(
      `providers-list:${user_id}`,
    )

    console.log(users)

    if (!users) {
      users = await this.usersRepository.findAllProviders({
        except_id: user_id,
      })

      console.log('A query no banco foi feita')

      await this.cacheProvider.save(`providers-list:${user_id}`, users)
    }

    return users
  }
}

export default ListProvidersService

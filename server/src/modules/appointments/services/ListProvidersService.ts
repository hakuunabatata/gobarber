import { inject, injectable } from 'tsyringe'
import User from '@modules/users/infra/typeorm/entities/Users'

import CacheProvider from '@shared/container/providers/CacheProvider/models/CacheProvider'
import AppError from '@shared/errors/AppError'
import UserRepository from '@modules/users/repositories/UserRepository'
import { classToClass } from 'class-transformer'

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

    if (!users) {
      users = await this.usersRepository.findAllProviders({
        except_id: user_id,
      })

      await this.cacheProvider.save(
        `providers-list:${user_id}`,
        classToClass(users),
      )
    }

    return users
  }
}

export default ListProvidersService

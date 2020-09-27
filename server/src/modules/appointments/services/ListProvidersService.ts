import { inject, injectable } from 'tsyringe'
import User from '@modules/users/infra/typeorm/entities/Users'

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
  ) {}

  public async execute({ user_id }: Request): Promise<User[]> {
    const users = await this.usersRepository.findAllProviders({
      except_id: user_id,
    })

    return users
  }
}

export default ListProvidersService

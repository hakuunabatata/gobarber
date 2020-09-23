import { inject, injectable } from 'tsyringe'
import User from '../infra/typeorm/entities/Users'

import AppError from '@shared/errors/AppError'
import UserRepository from '../repositories/UserRepository'

interface Request {
  user_id: string
}

@injectable()
class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UserRepository,
  ) {}

  public async execute({ user_id }: Request): Promise<User> {
    const user = await this.usersRepository.findById(user_id)

    if (!user) {
      throw new AppError('user not found')
    }

    return user
  }
}

export default ShowProfileService

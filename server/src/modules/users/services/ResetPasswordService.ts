import { inject, injectable } from 'tsyringe'
import { isAfter, addHours } from 'date-fns'

import AppError from '@shared/errors/AppError'

import UserRepository from '../repositories/UserRepository'
import UserTokensRepository from '../repositories/UserTokensRepository'
import HashProvider from '../providers/HashProvider/models/HashProvider'

interface Request {
  token: string
  password: string
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UserRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: UserTokensRepository,

    @inject('HashProvider')
    private hashProvider: HashProvider,
  ) {}

  public async execute({ token, password }: Request): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token)

    if (!userToken) {
      throw new AppError('User token does not exists')
    }

    const user = await this.usersRepository.findById(userToken.user_id)

    if (!user) {
      throw new AppError('User does not exists')
    }

    const tokenCreatedAt = userToken.created_at

    const compareDate = addHours(tokenCreatedAt, 2)

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired')
    }

    user.password = await this.hashProvider.generateHash(password)

    await this.usersRepository.save(user)
  }
}
export default ResetPasswordService

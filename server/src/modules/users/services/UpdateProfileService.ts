import { inject, injectable } from 'tsyringe'
import User from '../infra/typeorm/entities/Users'

import AppError from '@shared/errors/AppError'
import UserRepository from '../repositories/UserRepository'
import HashProvider from '../providers/HashProvider/models/HashProvider'

interface Request {
  name: string
  email: string
  password?: string
  old_password?: string
  user_id: string
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UserRepository,

    @inject('HashProvider')
    private hashProvider: HashProvider,
  ) {}

  public async execute({
    name,
    email,
    password,
    old_password,
    user_id,
  }: Request): Promise<User> {
    const user = await this.usersRepository.findById(user_id)

    if (!user) {
      throw new AppError('user not found')
    }

    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email)

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
      throw new AppError('This Email is already in use')
    }

    user.name = name
    user.email = email

    if (password && !old_password) {
      throw new AppError('Old Password is Required')
    }

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      )

      if (!checkOldPassword) {
        throw new AppError('ldPassword does not match')
      }
    }

    if (password) {
      user.password = await this.hashProvider.generateHash(password)
    }

    return this.usersRepository.save(user)
  }
}

export default UpdateProfileService

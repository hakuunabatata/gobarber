import { inject, injectable } from 'tsyringe'
import AppError from '@shared/errors/AppError'

import User from '../infra/typeorm/entities/Users'
import UserRepository from '../repositories/UserRepository'
import HashProvider from '../providers/HashProvider/models/HashProvider'
import CacheProvider from '@shared/container/providers/CacheProvider/models/CacheProvider'

interface Request {
  name: string
  email: string
  password: string
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UserRepository,

    @inject('HashProvider')
    private hashProvider: HashProvider,

    @inject('CacheProvider')
    private cacheProvider: CacheProvider,
  ) {}

  public async execute({ name, email, password }: Request): Promise<User> {
    const checkUserExists = await this.usersRepository.findByEmail(email)

    if (checkUserExists) {
      throw new AppError('Email address already used')
    }

    const hashedPassword = await this.hashProvider.generateHash(password)

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    })

    await this.cacheProvider.invalidatePrefix(`providers-list`)

    return user
  }
}
export default CreateUserService

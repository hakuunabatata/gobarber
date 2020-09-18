import { getRepository, Repository } from 'typeorm'

import UserRepository from '@modules/users/repositories/UserRepository'
import CreateUserDTO from '@modules/users/dtos/CreateUserDTO'

import User from '../entities/Users'

class UsersRepository implements UserRepository {
  private ormRepository: Repository<User>

  constructor() {
    this.ormRepository = getRepository(User)
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id)
    return user
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({ where: { email } })
    return user
  }

  public async create({ name, email, password }: CreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({ name, email, password })

    await this.ormRepository.save(user)

    return user
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user)
  }
}

export default UsersRepository

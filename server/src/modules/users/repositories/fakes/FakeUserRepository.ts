import { uuid } from 'uuidv4'
import UserRepository from '@modules/users/repositories/UserRepository'
import CreateUserDTO from '@modules/users/dtos/CreateUserDTO'
import FindAllProvidersDTO from '@modules/users/dtos/FindAllProvidersDTO'

import User from '../../infra/typeorm/entities/Users'

class UsersRepository implements UserRepository {
  private users: User[] = []

  public async findById(id: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.id === id)
    return findUser
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.email === email)
    return findUser
  }

  public async create({ name, email, password }: CreateUserDTO): Promise<User> {
    const user = new User()
    Object.assign(user, { id: uuid(), name, email, password })
    this.users.push(user)

    return user
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id)

    this.users[findIndex] = user

    return user
  }

  public async findAllProviders({
    except_id,
  }: FindAllProvidersDTO): Promise<User[]> {
    let { users } = this

    if (except_id) {
      users = this.users.filter(user => user.id !== except_id)
    }

    return users
  }
}

export default UsersRepository

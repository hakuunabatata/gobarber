import User from '../infra/typeorm/entities/Users'
import CreateUserDTO from '../dtos/CreateUserDTO'
import FindAllProvidersDTO from '../dtos/FindAllProvidersDTO'

export default interface UserRepository {
  findAllProviders(data: FindAllProvidersDTO): Promise<User[]>
  findById(id: string): Promise<User | undefined>
  findByEmail(email: string): Promise<User | undefined>
  create(data: CreateUserDTO): Promise<User>
  save(user: User): Promise<User>
}

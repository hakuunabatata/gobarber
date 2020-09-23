import { getRepository, Repository } from 'typeorm'

import UserTokenRepository from '@modules/users/repositories/UserTokensRepository'
import CreateUserDTO from '@modules/users/dtos/CreateUserDTO'

import UserToken from '../entities/UserToken'

class UserTokensRepository implements UserTokenRepository {
  private ormRepository: Repository<UserToken>

  constructor() {
    this.ormRepository = getRepository(UserToken)
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const user = await this.ormRepository.findOne({ where: { token } })
    return user
  }

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = this.ormRepository.create({
      user_id,
    })

    await this.ormRepository.save(userToken)

    return userToken
  }
}

export default UserTokensRepository

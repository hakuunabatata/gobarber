import HashProvider from '../models/HashProvider'

export default class FakeHashProvider implements HashProvider {
  public async generateHash(payload: string): Promise<string> {
    return payload
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return payload === hashed
  }
}

import { container } from 'tsyringe'
import uploadConfig from '@config/upload'

import CacheProvider from './models/CacheProvider'

import RedisCacheProvider from './implementations/RedisCacheProvider'

const providers = {
  redis: RedisCacheProvider,
}

container.registerSingleton<CacheProvider>('CacheProvider', providers.redis)

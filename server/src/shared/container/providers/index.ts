import { container } from 'tsyringe'

import StorageProvider from './StorageProvider/models/StorageProvider'
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider'

container.registerSingleton<StorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
)

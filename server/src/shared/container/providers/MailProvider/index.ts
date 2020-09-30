import { container } from 'tsyringe'

import MailConfig from '@config/mail'
import EtherealMailProvider from './implementations/EtherealMailProvider'
import SESMailProvider from './implementations/SESMailProvider'
import MailProvider from './models/MailProvider'

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
  ses: container.resolve(SESMailProvider),
}

container.registerInstance<MailProvider>(
  'MailProvider',
  providers[MailConfig.driver],
)

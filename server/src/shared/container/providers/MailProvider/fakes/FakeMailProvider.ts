import SendMailDTO from '../dtos/SendMailDTO'
import MailProvider from '../models/MailProvider'

interface Message {
  to: string
  body: string
}

export default class FakeMailProvider implements MailProvider {
  private messages: SendMailDTO[] = []

  public async sendMail(message: SendMailDTO): Promise<void> {
    this.messages.push(message)
  }
}

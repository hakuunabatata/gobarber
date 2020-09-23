import nodemailer, { Transporter } from 'nodemailer'
import { inject, injectable } from 'tsyringe'
import MailTemplateProvider from '../../MailTemplateProvider/models/MailTemplateProvider'
import SendMailDTO from '../dtos/SendMailDTO'

import MailProvider from '../models/MailProvider'

@injectable()
export default class EtherealMailProvider implements MailProvider {
  private client: Transporter

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: MailTemplateProvider,
  ) {
    nodemailer.createTestAccount().then(account => {
      const { host, port, secure } = account.smtp
      const { user, pass } = account
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user,
          pass,
        },
      })

      this.client = transporter
    })
  }

  public async sendMail({
    to,
    subject,
    from,
    templateData,
  }: SendMailDTO): Promise<void> {
    const message = await this.client.sendMail({
      from: {
        name: from?.name || 'GoBarberTeam',
        address: from?.email || 'equipe@gobarber.com.br',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    })

    console.log(`Message sent: ${message.messageId}`)
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(message)}`)
  }
}

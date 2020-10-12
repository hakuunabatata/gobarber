import nodemailer, { Transporter } from 'nodemailer'
import { inject, injectable } from 'tsyringe'
import aws from 'aws-sdk'

import MailTemplateProvider from '../../MailTemplateProvider/models/MailTemplateProvider'
import SendMailDTO from '../dtos/SendMailDTO'

import MailProvider from '../models/MailProvider'

import mailConfig from '@config/mail'

@injectable()
export default class SESMailProvider implements MailProvider {
  private client: Transporter

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: MailTemplateProvider,
  ) {
    this.client = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01',
      }),
    })
  }

  public async sendMail({
    to,
    subject,
    from,
    templateData,
  }: SendMailDTO): Promise<void> {
    const { name, email } = mailConfig.defaults.from

    await this.client.sendMail({
      from: {
        name: from?.name || name,
        address: from?.email || email,
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    })
    console.log('Oia o email indo, Ala => ********')
  }
}
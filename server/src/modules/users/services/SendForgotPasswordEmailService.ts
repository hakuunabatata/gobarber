import { inject, injectable } from 'tsyringe'
import path from 'path'

import AppError from '@shared/errors/AppError'

import UserRepository from '../repositories/UserRepository'
import UserTokensRepository from '../repositories/UserTokensRepository'
import MailProvider from '@shared/container/providers/MailProvider/models/MailProvider'

interface Request {
  email: string
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UserRepository,

    @inject('MailProvider')
    private mailProvider: MailProvider,

    @inject('UserTokensRepository')
    private userTokensRepository: UserTokensRepository,
  ) {}

  public async execute({ email }: Request): Promise<void> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) throw new AppError('User does not exists')

    const { token } = await this.userTokensRepository.generate(user.id)

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    )

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[GoBarber] Recuperação de senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `http://localhost:3000/reset_password?token=${token}`,
        },
      },
    })
  }
}
export default SendForgotPasswordEmailService

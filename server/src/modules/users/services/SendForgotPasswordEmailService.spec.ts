import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '../repositories/fakes/FakeUserRepository'
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository'
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider'

import SendForgotPasswordEmailService from './SendForgotPasswordEmailService'

let fakeUserRepository: FakeUsersRepository
let fakeMailProvider: FakeMailProvider
let fakeUserTokensRepository: FakeUserTokensRepository
let SendForgotPasswordEmail: SendForgotPasswordEmailService

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository()
    fakeMailProvider = new FakeMailProvider()
    fakeUserTokensRepository = new FakeUserTokensRepository()

    SendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUserRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    )
  })

  it('should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail')

    await fakeUserRepository.create({
      email: 'fulano@a.com',
      name: 'John Doe',
      password: '123456',
    })

    await SendForgotPasswordEmail.execute({
      email: 'fulano@a.com',
    })

    expect(sendMail).toHaveBeenCalled()
  })

  it('should not be able to recover a non-existing user password', async () => {
    await expect(
      SendForgotPasswordEmail.execute({
        email: 'fulano@a.com',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate')

    const user = await fakeUserRepository.create({
      email: 'fulano@a.com',
      name: 'John Doe',
      password: '123456',
    })

    await SendForgotPasswordEmail.execute({
      email: 'fulano@a.com',
    })

    expect(generateToken).toHaveBeenCalledWith(user.id)
  })
})

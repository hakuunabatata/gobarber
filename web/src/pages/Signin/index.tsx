import React, { useCallback, useRef } from 'react'
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import * as Yup from 'yup'

import { Container, Content, Background } from './styles'
import logoImg from '../../assets/logo.svg'
import Input from '../../components/Input'
import Button from '../../components/Button'

import { useAuth } from '../../hooks/auth'
import { useToast } from '../../hooks/toast'
import getValidationErrors from '../../utils/getValidationError'

interface SignInFormData {
  email: string
  password: string
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null)

  const { signIn } = useAuth()
  const { addToast } = useToast()

  const submit = useCallback(
    async (data: SignInFormData): Promise<void> => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          email: Yup.string()

            .required('Email obrigatorio')
            .email('Digite um email valido'),
          password: Yup.string().required('Senha obrigatoria'),
        })

        await schema.validate(data, { abortEarly: false })

        const { email, password } = data

        await signIn({
          email,
          password,
        })
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)

          formRef.current?.setErrors(errors)
        }

        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description: 'Ocorreu um erro ao fazer login, tente novamente!',
        })
      }
    },
    [signIn, addToast],
  )

  return (
    <>
      <Container>
        <Content>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={submit}>
            <h1>Faça seu login</h1>
            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Input
              name="password"
              icon={FiLock}
              placeholder="Senha"
              type="password"
            />
            <Button type="submit">Entrar</Button>

            <a href="forgot">Esqueci minha senha</a>
          </Form>

          <a href="account">
            <FiLogIn />
            Criar Conta
          </a>
        </Content>

        <Background />
      </Container>
    </>
  )
}

export default SignIn

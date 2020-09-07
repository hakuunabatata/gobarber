import React, { useCallback, useRef } from 'react'
import { FiMail, FiUser, FiLock, FiArrowLeft } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import * as Yup from 'yup'
import getValidationErrors from '../../utils/getValidationError'

import { Container, Content, Background, AnimationContainer } from './styles'

import logoImg from '../../assets/logo.svg'

import Input from '../../components/Input'
import Button from '../../components/Button'

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null)

  const submit = useCallback(async (data: object): Promise<void> => {
    try {
      formRef.current?.setErrors({})

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatorio'),
        email: Yup.string()
          .required('Email obrigatorio')
          .email('Digite um email valido'),
        password: Yup.string().min(6, 'No minimo 6 digitos'),
      })

      await schema.validate(data, { abortEarly: false })
    } catch (err) {
      const errors = getValidationErrors(err)

      formRef.current?.setErrors(errors)
    }
  }, [])

  return (
    <>
      <Container>
        <Background />
        <Content>
          <AnimationContainer>
            <img src={logoImg} alt="GoBarber" />

            <Form ref={formRef} onSubmit={submit}>
              <h1>Faça seu cadastro</h1>
              <Input name="name" icon={FiUser} placeholder="Nome" />
              <Input name="email" icon={FiMail} placeholder="E-mail" />
              <Input
                name="password"
                icon={FiLock}
                placeholder="Senha"
                type="password"
              />
              <Button type="submit">Cadastrar</Button>
            </Form>

            <Link to="/">
              <FiArrowLeft />
              Voltar para Login
            </Link>
          </AnimationContainer>
        </Content>
      </Container>
    </>
  )
}

export default SignUp

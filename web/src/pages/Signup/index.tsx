import React from 'react'
import { FiMail, FiUser, FiLock, FiArrowLeft } from 'react-icons/fi'
import { Form } from '@unform/web'

import { Container, Content, Background } from './styles'

import logoImg from '../../assets/logo.svg'

import Input from '../../components/Input'
import Button from '../../components/Button'

const SignUp: React.FC = () => {
  function submit(data: object): void {
    console.log(data)
  }

  return (
    <>
      <Container>
        <Background />
        <Content>
          <img src={logoImg} alt="GoBarber" />

          <Form onSubmit={submit}>
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

          <a href="account">
            <FiArrowLeft />
            Voltar para Login
          </a>
        </Content>
      </Container>
    </>
  )
}

export default SignUp

import React, { useCallback, useRef, ChangeEvent } from 'react'
import { FiMail, FiUser, FiLock, FiCamera, FiArrowLeft } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import * as Yup from 'yup'
import getValidationErrors from '../../utils/getValidationError'
import { Link } from 'react-router-dom'

import { Container, Content, AvatarInput } from './styles'

import Input from '../../components/Input'
import Button from '../../components/Button'
import api from '../../services/api'
import { useToast } from '../../hooks/toast'
import { useAuth } from '../../hooks/auth'

interface ProfileFormData {
  name: string
  email: string
  password: string
  old_password: string
  password_confirmation: string
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const history = useHistory()

  const { user, updateUser } = useAuth()

  const submit = useCallback(
    async (data: ProfileFormData): Promise<void> => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatorio'),
          email: Yup.string()
            .required('Email obrigatorio')
            .email('Digite um email valido'),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string().required('Campo obrigatorio'),
            otherwise: Yup.string(),
          }),
          old_password: Yup.string(),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: val => !!val.length,
              then: Yup.string().required('Campo obrigatorio'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), undefined], 'Confirmacao incorreta'),
        })

        await schema.validate(data, { abortEarly: false })

        const {
          name,
          email,
          password,
          old_password,
          password_confirmation,
        } = data

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        }

        const res = await api.put('/profile', data)

        updateUser(res.data)

        history.push('dashboard')

        addToast({
          type: 'success',
          title: 'Perfil atualizado',
          description: 'Suas informacoes foram atualizadas',
        })
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)

          formRef.current?.setErrors(errors)
          return
        }

        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: 'Ocorreu um erro ao criar o cadastro, tente novamente!',
        })
      }
    },
    [addToast, history],
  )

  const avatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData()
        data.append('avatar', e.target.files[0])

        api.patch('/users/avatar', data).then(({ data }) => {
          updateUser(data)

          addToast({
            type: 'success',
            title: 'Avatar atualizado',
          })
        })
      }
    },
    [addToast],
  )

  return (
    <>
      <Container>
        <header>
          <div>
            <Link to="/dashboard">
              <FiArrowLeft />
            </Link>
          </div>
        </header>

        <Content>
          <Form
            ref={formRef}
            initialData={{ name: user.name, email: user.email }}
            onSubmit={submit}
          >
            <AvatarInput>
              <img src={user.avatar_url} alt={user.name} />
              <label htmlFor="avatar">
                <FiCamera />
                <input type="file" id="avatar" onChange={avatarChange} />
              </label>
            </AvatarInput>

            <h1>Meu Perfil</h1>

            <Input name="name" icon={FiUser} placeholder="Nome" />
            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Input
              containerStyle={{ marginTop: 24 }}
              name="old_password"
              icon={FiLock}
              placeholder="Senha Atual"
              type="password"
            />
            <Input
              name="password"
              icon={FiLock}
              placeholder="Nova Senha"
              type="password"
            />
            <Input
              name="password_confirmation"
              icon={FiLock}
              placeholder="Confirmar Senha"
              type="password"
            />
            <Button type="submit">Confirmar Mudanças</Button>
          </Form>
        </Content>
      </Container>
    </>
  )
}

export default Profile

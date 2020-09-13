import React, { useCallback, useRef } from 'react'
import {
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'
import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'

import Input from '../../components/Input'
import Button from '../../components/Button'

import getValidationErrors from '../../utils/getValidationError'

import logoImg from '../../assets/logo.png'

import {
  Container,
  Title,
  ForgotPswd,
  ForgotPswdText,
  CreateAccount,
  CreateAccountText,
} from './styles'

interface SignInFormData {
  email: string
  password: string
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const pswdInputRef = useRef<TextInput>(null)
  const navigation = useNavigation()

  const handleSignIn = useCallback(async (data: SignInFormData): Promise<
    void
  > => {
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

      // await signIn({
      //   email,
      //   password,
      // })
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err)

        formRef.current?.setErrors(errors)
        return
      }

      Alert.alert(
        'Erro na autenticação',
        'Ocorreu um erro ao fazer login, tente novamente!',
      )
    }
  }, [])

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flex: 1 }}
      >
        <Container>
          <Image source={logoImg} />
          <View>
            <Title>Faça seu Login</Title>
          </View>

          <Form ref={formRef} onSubmit={handleSignIn}>
            <Input
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              name="email"
              icon="mail"
              placeholder="E-mail"
              returnKeyType="next"
              onSubmitEditing={() => {
                pswdInputRef.current?.focus()
              }}
            />

            <Input
              ref={pswdInputRef}
              name="password"
              icon="lock"
              placeholder="Senha"
              secureTextEntry
              returnKeyType="send"
              onSubmitEditing={() => {
                formRef.current?.submitForm()
              }}
            />

            <Button
              onPress={() => {
                formRef.current?.submitForm()
              }}
            >
              Entrar
            </Button>
          </Form>

          <ForgotPswd>
            <ForgotPswdText>Esqueci minha senha</ForgotPswdText>
          </ForgotPswd>

          <CreateAccount onPress={() => navigation.navigate('SignUp')}>
            <Icon name="log-in" size={20} color="#ff9000" />
            <CreateAccountText>Criar uma Conta</CreateAccountText>
          </CreateAccount>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default SignIn

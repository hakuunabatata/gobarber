import React, { useRef, useCallback } from 'react'
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

import api from '../../services/api'

import Input from '../../components/Input'
import Button from '../../components/Button'

import getValidationErrors from '../../utils/getValidationError'

import logoImg from '../../assets/logo.png'

import { Container, Title, BackToSignIn, BackToSignInText } from './styles'

interface SignUpFormData {
  email: string
  name: string
  password: string
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const navigation = useNavigation()

  const emailInputRef = useRef<TextInput>(null)
  const pswdInputRef = useRef<TextInput>(null)

  const handleSignUp = useCallback(
    async (data: SignUpFormData): Promise<void> => {
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

        await api.post('/users', data)

        Alert.alert(
          'Cadastro realizado com sucesso',
          'Voce já pode fazer login no App.',
        )

        navigation.navigate('SignIn')
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)

          formRef.current?.setErrors(errors)
          return
        }

        Alert.alert(
          'Erro no cadastro',
          'Ocorreu um erro ao criar o cadastro, tente novamente!',
        )
      }
    },
    [navigation],
  )

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
            <Title>Crie sua Conta</Title>
          </View>
          <Form ref={formRef} onSubmit={handleSignUp}>
            <Input
              autoCapitalize="words"
              name="name"
              icon="user"
              placeholder="Nome"
              returnKeyType="next"
              onSubmitEditing={() => {
                emailInputRef.current?.focus()
              }}
            />
            <Input
              ref={emailInputRef}
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
              secureTextEntry
              name="password"
              icon="lock"
              placeholder="Senha"
              textContentType="newPassword"
              returnKeyType="send"
              onSubmitEditing={() => formRef.current?.submitForm()}
            />
            <Button onPress={() => formRef.current?.submitForm()}>
              Entrar
            </Button>
          </Form>

          <BackToSignIn onPress={() => navigation.navigate('SignIn')}>
            <Icon name="arrow-left" size={20} color="#fff" />
            <BackToSignInText>Voltar para login</BackToSignInText>
          </BackToSignIn>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default SignUp

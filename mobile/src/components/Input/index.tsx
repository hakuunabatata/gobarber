import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { TextInputProps } from 'react-native'
import { useField } from '@unform/core'

import { Container, TextInput, Icon } from './styles'

interface InputProps extends TextInputProps {
  name: string
  icon: string
}

interface InputValueReference {
  value: string
}

interface InputRef {
  focus(): void
}

const Input: React.RefForwardingComponent<InputRef, InputProps> = (
  { name, icon, ...rest },
  ref,
) => {
  const { registerField, defaultValue = '', fieldName, error } = useField(name)
  const inputElementRef = useRef<any>(null)
  const inputValueRef = useRef<InputValueReference>({ value: defaultValue })

  const [focused, setFocused] = useState(false)
  const [filled, setFilled] = useState(false)

  const inputFocus = useCallback(() => {
    setFocused(true)
  }, [])

  const inputBlur = useCallback(() => {
    setFocused(false)

    setFilled(!!inputValueRef.current.value)
  }, [])

  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current.focus()
    },
  }))

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
      setValue(ref: any, value) {
        inputValueRef.current.value = value
        inputElementRef.current.setNativeProps({ text: value })
      },
      clearValue() {
        inputValueRef.current.value = ''
        inputElementRef.current.clear()
      },
    })
  }, [fieldName, registerField])

  return (
    <Container isFocused={focused} isErrored={!!error}>
      <Icon
        name={icon}
        size={20}
        color={focused || filled ? '#ff9000' : !!error ? '#c53030' : '#666360'}
      />

      <TextInput
        ref={inputElementRef}
        keyboardAppearance="dark"
        placeholderTextColor="#666360"
        onChangeText={value => {
          inputValueRef.current.value = value
        }}
        onFocus={inputFocus}
        onBlur={inputBlur}
        {...rest}
      />
    </Container>
  )
}

export default forwardRef(Input)

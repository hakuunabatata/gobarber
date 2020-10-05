import React, { ButtonHTMLAttributes } from 'react'

import { Container } from './styles'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
}

const Button: React.FC<ButtonProps> = ({ loading, children, ...rest }) => (
  <Container {...rest}>{loading ? 'Carregando ...' : children}</Container>
)

export default Button

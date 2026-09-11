import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AuthThemeProvider,
  LoginForm,
  login,
  saveAccessToken,
  AuthApiError,
  type LoginFormValues,
} from '@/features/auth'

export function LoginPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()

  const handleSubmit = async (values: LoginFormValues) => {
    setIsLoading(true)
    setErrorMessage(undefined)
    try {
      const { accessToken } = await login({
        email: values.email,
        password: values.password,
      })
      saveAccessToken(accessToken, values.remember)
      navigate('/inicio')
    } catch (error) {
      if (error instanceof AuthApiError) {
        setErrorMessage(
          error.status === 401
            ? 'Correo o contraseña incorrectos.'
            : error.message,
        )
        return
      }
      setErrorMessage('No se pudo iniciar sesión. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthThemeProvider>
      <LoginForm
        onSubmit={handleSubmit}
        onForgotPassword={() => navigate('/olvide-contrasena')}
        onRegister={() => navigate('/registro')}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
    </AuthThemeProvider>
  )
}

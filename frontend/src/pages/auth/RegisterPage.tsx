import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AuthThemeProvider,
  RegisterForm,
  type RegisterFormValues,
} from '@/features/auth'

export function RegisterPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()

  const handleSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true)
    setErrorMessage(undefined)
    try {
      console.log('Registro con:', values)
      navigate('/')
    } catch {
      setErrorMessage('Ese correo ya está registrado.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthThemeProvider>
      <RegisterForm
        onSubmit={handleSubmit}
        onLogin={() => navigate('/')}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
    </AuthThemeProvider>
  )
}

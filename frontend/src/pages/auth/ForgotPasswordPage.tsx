import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthThemeProvider, ForgotPasswordForm } from '@/features/auth'

export function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (email: string) => {
    setIsLoading(true)
    try {
      console.log('Enviar link de recuperación a:', email)
      setEmailSent(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthThemeProvider>
      <ForgotPasswordForm
        onSubmit={handleSubmit}
        onBackToLogin={() => navigate('/')}
        isLoading={isLoading}
        emailSent={emailSent}
      />
    </AuthThemeProvider>
  )
}

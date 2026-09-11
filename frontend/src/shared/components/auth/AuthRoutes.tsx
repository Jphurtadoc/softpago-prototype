import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import {
  authTheme,
  LoginForm,
  RegisterForm,
  ForgotPasswordForm,
  type LoginFormValues,
  type RegisterFormValues,
} from '@/features/auth';

/**

 * 
 * Example of how to connect the 3 screens with react-router-dom.
 * Add these routes where you already define your <Routes> (e.g. in App.tsx): 
 *
 *   <Route path="/login" element={<LoginPage />} />
 *   <Route path="/registro" element={<RegisterPage />} />
 *   <Route path="/olvide-contrasena" element={<ForgotPasswordPage />} />
 */

export function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setErrorMessage(undefined);
    try {
      // Everything is commented out for now, but you would typically call your login API here. For example:
      // await api.login(values);
      console.log('Login con:', values);
      navigate('/navbar');
    } catch {
      setErrorMessage('Correo o contraseña incorrectos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={authTheme}>
      <CssBaseline />
      <LoginForm
        onSubmit={handleSubmit}
        onForgotPassword={() => navigate('/olvide-contrasena')}
        onRegister={() => navigate('/registro')}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
    </ThemeProvider>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    setErrorMessage(undefined);
    try {
      console.log('Registro con:', values);
      navigate('/');
    } catch {
      setErrorMessage('Ese correo ya está registrado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={authTheme}>
      <CssBaseline />
      <RegisterForm
        onSubmit={handleSubmit}
        onLogin={() => navigate('/login')}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
    </ThemeProvider>
  );
}

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (email: string) => {
    setIsLoading(true);
    try {
      console.log('Enviar link de recuperación a:', email);
      setEmailSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={authTheme}>
      <CssBaseline />
      <ForgotPasswordForm
        onSubmit={handleSubmit}
        onBackToLogin={() => navigate('/login')}
        isLoading={isLoading}
        emailSent={emailSent}
      />
    </ThemeProvider>
  );
}

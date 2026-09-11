// features/auth/index.ts
export { default as LoginForm } from './components/LoginForm/LoginForm'
export type { LoginFormValues } from './components/LoginForm/LoginForm'

export { default as RegisterForm } from './components/RegisterForm/RegisterForm'
export type { RegisterFormValues } from './components/RegisterForm/RegisterForm'

export { default as ForgotPasswordForm } from './components/ForgotPassword/ForgotPasswordForm'

export { authTheme, createAuthTheme } from './themes/authTheme'
export { AUTH_BRAND_TOKENS } from './themes/auth-brand-tokens'
export {
  AuthThemeProvider,
  useAuthColorMode,
} from './themes/auth-color-mode-context'
export type { AuthColorModePreference } from './themes/auth-color-mode-context'

export {
  login,
  saveAccessToken,
  getAccessToken,
  clearAccessToken,
  AuthApiError,
} from './services/auth.service'
export type { LoginRequest, LoginResponse } from './types/auth.types'

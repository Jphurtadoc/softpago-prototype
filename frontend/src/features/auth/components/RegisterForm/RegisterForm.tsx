import { useState, type FormEvent, type ReactNode } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import AuthLayout from '../AuthLayout/AuthLayout';

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
}

export interface RegisterFormProps {
  onSubmit?: (values: RegisterFormValues) => void;

  onLogin?: () => void;

  isLoading?: boolean;

  errorMessage?: string;

  logo?: ReactNode;
}

const MIN_PASSWORD_LENGTH = 8;
const EXIT_ANIMATION_MS = 320;

function RegisterForm({
  onSubmit,
  onLogin,
  isLoading = false,
  errorMessage,
  logo,
}: RegisterFormProps) {
  const { t } = useTranslation('auth/create-account');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);
  const [exiting, setExiting] = useState(false);

  const nameError = touched && name.trim().length < 2;
  const emailError = touched && !/^\S+@\S+\.\S+$/.test(email);
  const passwordError = touched && password.length < MIN_PASSWORD_LENGTH;
  const confirmError = touched && confirmPassword !== password;

  const isValid =
    name.trim().length >= 2 &&
    /^\S+@\S+\.\S+$/.test(email) &&
    password.length >= MIN_PASSWORD_LENGTH &&
    confirmPassword === password;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;
    onSubmit?.({ name, email, password });
  };

  const navigateWithExit = (callback?: () => void) => {
    setExiting(true);
    window.setTimeout(() => callback?.(), EXIT_ANIMATION_MS);
  };

  return (
    <AuthLayout
      title={t('title')}
      subtitle={t('subtitle')}
      logo={logo}
      brandMark="logo"
      accentDirection="right"
      exiting={exiting}
    >
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={1.5}>
          {errorMessage && (
            <Alert severity="error" variant="outlined">
              {errorMessage}
            </Alert>
          )}

          <TextField
            label={t('nameLabel')}
            fullWidth
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={nameError}
            helperText={nameError ? t('nameRequired') : undefined}
            disabled={isLoading}
            autoFocus
          />

          <TextField
            label={t('emailLabel')}
            type="email"
            fullWidth
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
            helperText={emailError ? t('emailInvalid') : undefined}
            disabled={isLoading}
          />

          <TextField
            label={t('passwordLabel')}
            type={showPassword ? 'text' : 'password'}
            fullWidth
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError}
            helperText={
              passwordError
                ? t('passwordMinLength', { min: MIN_PASSWORD_LENGTH })
                : undefined
            }
            disabled={isLoading}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((v) => !v)}
                      edge="end"
                      aria-label={
                        showPassword ? t('hidePassword') : t('showPassword')
                      }
                      tabIndex={-1}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            label={t('confirmPasswordLabel')}
            type={showPassword ? 'text' : 'password'}
            fullWidth
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={confirmError}
            helperText={confirmError ? t('passwordMismatch') : undefined}
            disabled={isLoading}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={isLoading}
            startIcon={
              isLoading ? (
                <CircularProgress size={18} color="inherit" />
              ) : undefined
            }
          >
            {isLoading ? t('submitting') : t('submit')}
          </Button>

          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            {t('hasAccount')}{' '}
            <Link
              component="button"
              type="button"
              onClick={() => navigateWithExit(onLogin)}
              underline="hover"
              sx={{ fontWeight: 600 }}
            >
              {t('loginLink')}
            </Link>
          </Typography>
        </Stack>
      </Box>
    </AuthLayout>
  );
}

export default RegisterForm;

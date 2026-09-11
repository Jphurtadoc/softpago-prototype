import { useState, type FormEvent, type ReactNode } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import AuthLayout from '@/features/auth/components/AuthLayout/AuthLayout';

export interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

export interface LoginFormProps {
  /** Requires an ancestor {@link AuthThemeProvider} for the theme mode toggle. */
  onSubmit?: (values: LoginFormValues) => void;

  onForgotPassword?: () => void;

  onRegister?: () => void;

  isLoading?: boolean;

  errorMessage?: string;

  logo?: ReactNode;
}

const EXIT_ANIMATION_MS = 320;

function LoginForm({
  onSubmit,
  onForgotPassword,
  onRegister,
  isLoading = false,
  errorMessage,
  logo,
}: LoginFormProps) {
  const { t } = useTranslation('auth/login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);
  const [exiting, setExiting] = useState(false);

  const emailError = touched && !/^\S+@\S+\.\S+$/.test(email);
  const passwordError = touched && password.length < 1;
  const isValid = /^\S+@\S+\.\S+$/.test(email) && password.length > 0;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;
    onSubmit?.({ email, password, remember });
  };

  /** Dispara la salida animada de los chevrons antes de navegar a otra pantalla */
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
      accentDirection="left"
      exiting={exiting}
    >
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2.5}>
          {errorMessage && (
            <Alert severity="error" variant="outlined">
              {errorMessage}
            </Alert>
          )}

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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError}
            helperText={passwordError ? t('passwordRequired') : undefined}
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
                      sx={{ minWidth: 44, minHeight: 44 }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Stack
            direction="row"
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: -1.5,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  disabled={isLoading}
                  sx={{ '& .MuiSvgIcon-root': { fontSize: 22 } }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('rememberMe')}
                </Typography>
              }
            />
            <Link
              component="button"
              type="button"
              variant="body2"
              onClick={() => navigateWithExit(onForgotPassword)}
              underline="hover"
              sx={{
                minHeight: 44,
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              {t('forgotPassword')}
            </Link>
          </Stack>

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
            {t('noAccount')}{' '}
            <Link
              component="button"
              type="button"
              onClick={() => navigateWithExit(onRegister)}
              underline="hover"
              sx={{
                fontWeight: 600,
                minHeight: 44,
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              {t('registerLink')}
            </Link>
          </Typography>
        </Stack>
      </Box>
    </AuthLayout>
  );
}

export default LoginForm;

import { useState, type FormEvent, type ReactNode } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import AuthLayout from '../AuthLayout/AuthLayout';

export interface ForgotPasswordFormProps {
  onSubmit?: (email: string) => void;

  onBackToLogin?: () => void;

  isLoading?: boolean;

  errorMessage?: string;

  emailSent?: boolean;

  logo?: ReactNode;
}

const EXIT_ANIMATION_MS = 320;

function ForgotPasswordForm({
  onSubmit,
  onBackToLogin,
  isLoading = false,
  errorMessage,
  emailSent = false,
  logo,
}: ForgotPasswordFormProps) {
  const { t } = useTranslation('auth/forgot-password');
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [exiting, setExiting] = useState(false);

  const emailError = touched && !/^\S+@\S+\.\S+$/.test(email);
  const isValid = /^\S+@\S+\.\S+$/.test(email);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;
    onSubmit?.(email);
  };

  const navigateWithExit = (callback?: () => void) => {
    setExiting(true);
    window.setTimeout(() => callback?.(), EXIT_ANIMATION_MS);
  };

  if (emailSent) {
    return (
      <AuthLayout
        title={t('sentTitle')}
        logo={logo}
        brandMark="logo"
        accentDirection="up"
        exiting={exiting}
      >
        <Stack spacing={1.5} sx={{ alignItems: 'center', textAlign: 'center' }}>
          <Typography variant="body2">
            {t('sentBodyBefore')}{' '}
            <Typography
              component="span"
              sx={{ color: 'text.primary', fontWeight: 600 }}
            >
              {email}
            </Typography>
            {t('sentBodyAfter')}
          </Typography>
          <Link
            component="button"
            type="button"
            onClick={() => navigateWithExit(onBackToLogin)}
            underline="hover"
            sx={{ fontWeight: 600 }}
          >
            {t('backToLogin')}
          </Link>
        </Stack>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={t('title')}
      subtitle={t('subtitle')}
      logo={logo}
      brandMark="logo"
      accentDirection="up"
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
            label={t('emailLabel')}
            type="email"
            fullWidth
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
            helperText={emailError ? t('emailInvalid') : undefined}
            disabled={isLoading}
            autoFocus
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
            <Link
              component="button"
              type="button"
              onClick={() => navigateWithExit(onBackToLogin)}
              underline="hover"
              sx={{ fontWeight: 600 }}
            >
              {t('backToLogin')}
            </Link>
          </Typography>
        </Stack>
      </Box>
    </AuthLayout>
  );
}

export default ForgotPasswordForm;

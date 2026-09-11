import type { ReactNode } from 'react';
import { Box, Paper, Stack, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import ChevronAccent, {
  type ChevronDirection,
} from '../../../../shared/components/layouts/ChevronAccent';
import { AUTH_BRAND_TOKENS } from '../../themes/auth-brand-tokens';
import AuthBrandMark, {
  type AuthBrandMarkVariant,
} from '../AuthBrandMark/AuthBrandMark';
import LocaleToggle from '../LocaleToggle/LocaleToggle';
import ThemeModeToggle from '../ThemeModeToggle/ThemeModeToggle';

export interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  /** Overrides the default theme-aware brand mark. */
  logo?: ReactNode;
  /** Default mark when `logo` is omitted. Login should use `logo`. */
  brandMark?: AuthBrandMarkVariant;
  children: ReactNode;
  accentDirection?: ChevronDirection;
  exiting?: boolean;
  /** Shows the floating theme and locale selectors (bottom-right). */
  showThemeToggle?: boolean;
}

/** Dashboard `.app` ambient mesh — same layers as App.css (secondary lime). */
const DASHBOARD_MESH_DOT_LIGHT =
  'radial-gradient(circle, rgba(20, 22, 26, 0.05) 1px, transparent 1px)'
const DASHBOARD_MESH_DOT_DARK =
  'radial-gradient(circle, rgba(241, 239, 233, 0.04) 1px, transparent 1px)'

const dashboardLightBackgroundImage = [
  'radial-gradient(ellipse 620px 480px at 14% 16%, rgba(202, 255, 5, 0.14), transparent 60%)',
  'radial-gradient(ellipse 620px 520px at 88% 84%, rgba(202, 255, 5, 0.11), transparent 60%)',
  DASHBOARD_MESH_DOT_LIGHT,
].join(', ')

const dashboardDarkBackgroundImage = [
  'radial-gradient(ellipse 620px 480px at 14% 16%, rgba(202, 255, 5, 0.08), transparent 60%)',
  'radial-gradient(ellipse 620px 520px at 88% 84%, rgba(202, 255, 5, 0.06), transparent 60%)',
  DASHBOARD_MESH_DOT_DARK,
].join(', ')

function AuthLayout({
  title,
  subtitle,
  logo,
  brandMark = 'favicon',
  children,
  accentDirection = 'left',
  exiting = false,
  showThemeToggle = true,
}: AuthLayoutProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const brandNode = logo ?? <AuthBrandMark variant={brandMark} />;
  const isWordmark = brandMark === 'logo';
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const {
    backgroundDark,
    backgroundLight,
    surfaceGradientDark,
    surfaceGradientLight,
  } = AUTH_BRAND_TOKENS;

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: isDark ? backgroundDark : backgroundLight,
        backgroundImage: isDark
          ? dashboardDarkBackgroundImage
          : dashboardLightBackgroundImage,
        backgroundSize: 'auto, auto, 22px 22px',
        backgroundRepeat: 'no-repeat, no-repeat, repeat',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: 'calc(50% + 10vw)',
          width: '90vmax',
          height: '90vmax',
          transform: 'translate(-50%, -50%)',
          zIndex: 0,
          opacity: 1,
        }}
      >
        <ChevronAccent direction={accentDirection} exiting={exiting} />
      </Box>

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          height: '100vh',
          overflow: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          pb: { xs: 10, sm: 11 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 380,
            py: { xs: 3.5, sm: 4.5 },
            px: { xs: 2.5, sm: 3.5 },
            borderRadius: 3,
            background: isDark ? surfaceGradientDark : surfaceGradientLight,
            border: '1px solid',
            borderColor: isDark ? alpha(secondary, 0.14) : alpha(primary, 0.08),
            boxShadow: isDark
              ? `0 12px 32px ${alpha('#000000', 0.28)}`
              : `0 12px 28px ${alpha(primary, 0.06)}`,
          }}
        >
          <Stack spacing={3} sx={{ alignItems: 'center', mb: 4 }}>
            {brandNode && (
              <Box
                sx={{
                  width: isWordmark ? 190 : 58,
                  height: isWordmark ? 44 : 58,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {brandNode}
              </Box>
            )}

            <Stack spacing={0.5} sx={{ alignItems: 'center', mb: 4 }}>
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  textAlign: 'center',
                  color: 'text.primary',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                }}
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography
                  variant="body2"
                  sx={{ textAlign: 'center', color: 'text.secondary' }}
                >
                  {subtitle}
                </Typography>
              )}
            </Stack>
          </Stack>

          {children}
        </Paper>
      </Box>

      {showThemeToggle && (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            position: 'fixed',
            right: {
              xs: 'max(16px, env(safe-area-inset-right))',
              sm: 'max(24px, env(safe-area-inset-right))',
            },
            bottom: {
              xs: 'max(16px, env(safe-area-inset-bottom))',
              sm: 'max(24px, env(safe-area-inset-bottom))',
            },
            zIndex: 2,
            alignItems: 'center',
          }}
        >
          <LocaleToggle />
          <ThemeModeToggle />
        </Stack>
      )}
    </Box>
  );
}

export default AuthLayout;

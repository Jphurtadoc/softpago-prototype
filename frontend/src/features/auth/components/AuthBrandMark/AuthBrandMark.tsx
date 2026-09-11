import { Box, useTheme } from '@mui/material'

export type AuthBrandMarkVariant = 'favicon' | 'logo'

export interface AuthBrandMarkProps {
  /** `favicon` = icon mark; `logo` = full wordmark (login). */
  variant?: AuthBrandMarkVariant
}

const BRAND_SRC = {
  light: {
    favicon: '/favicon.svg',
    logo: '/logo.svg',
  },
  dark: {
    favicon: '/favicon_secondary.svg',
    logo: '/logo_secondary.svg',
  },
} as const

/**
 * SoftPago brand mark that swaps light/dark assets from the active auth theme.
 */
function AuthBrandMark({ variant = 'favicon' }: AuthBrandMarkProps) {
  const theme = useTheme()
  const src = BRAND_SRC[theme.palette.mode][variant]

  return (
    <Box
      component="img"
      src={src}
      alt="SoftPago"
      sx={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        display: 'block',
      }}
    />
  )
}

export default AuthBrandMark

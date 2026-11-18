import { BRAND_TOKENS } from '@/shared/themes/brand-tokens'

/**
 * Auth brand tokens — backgrounds mirror dashboard `.app` and sidebar.
 */
export const AUTH_BRAND_TOKENS = {
  primary: BRAND_TOKENS.primary,
  secondary: BRAND_TOKENS.secondary,
  backgroundDark: BRAND_TOKENS.backgroundDark,
  backgroundLight: BRAND_TOKENS.backgroundLight,
  surfaceDark: BRAND_TOKENS.surfaceDark,
  surfaceLight: BRAND_TOKENS.surfaceLight,
  surfaceGradientDark: `linear-gradient(180deg, ${BRAND_TOKENS.surfaceDark}, ${BRAND_TOKENS.surfaceDarkBottom})`,
  surfaceGradientLight: `linear-gradient(180deg, ${BRAND_TOKENS.backgroundLight}, ${BRAND_TOKENS.backgroundLightAlt})`,
  linkDark: BRAND_TOKENS.secondary,
  linkLight: BRAND_TOKENS.primary,
  linkHover: BRAND_TOKENS.secondarySoft,
  linkHoverLight: BRAND_TOKENS.primaryMid,
} as const

export type AuthBrandTokens = typeof AUTH_BRAND_TOKENS

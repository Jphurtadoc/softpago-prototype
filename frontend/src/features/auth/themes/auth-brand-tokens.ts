/**
 * SoftPago auth brand tokens — edit here to retheme the prototype.
 * Backgrounds mirror dashboard `.app` and sidebar so auth feels continuous.
 */
export const AUTH_BRAND_TOKENS = {
  /** Deep brand green (surfaces, primary actions in light). */
  primary: '#063832',
  /** Lime accent (CTAs in dark, highlights, brand mark). */
  secondary: '#caff05',
  /** Dark mode page background — matches `.app[data-theme='dark']`. */
  backgroundDark: '#0d0e12',
  /** Light mode page background — matches `.app[data-theme='light']`. */
  backgroundLight: '#f7f5f1',
  /** Dark mode elevated surface solid fallback — sidebar top. */
  surfaceDark: '#181a20',
  /** Light mode elevated surface solid fallback — sidebar top. */
  surfaceLight: '#f7f5f1',
  /** Sidebar-matched card fill (dark). */
  surfaceGradientDark: 'linear-gradient(180deg, #181a20, #101218)',
  /** Sidebar-matched card fill (light). */
  surfaceGradientLight: 'linear-gradient(180deg, #f7f5f1, #efece6)',
  /** High-contrast link color on dark backgrounds. */
  linkDark: '#D4FF33',
  /** Clearer green link color on light backgrounds. */
  linkLight: '#1B8A56',
  /** Link hover color on dark backgrounds. */
  linkHover: '#7EFF9A',
  /** Link hover color on light backgrounds. */
  linkHoverLight: '#0F6B42',
} as const

export type AuthBrandTokens = typeof AUTH_BRAND_TOKENS

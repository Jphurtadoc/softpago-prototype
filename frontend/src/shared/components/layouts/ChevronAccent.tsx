import { Box, useTheme } from '@mui/material'

export type ChevronDirection = 'left' | 'right' | 'up'

export interface ChevronAccentProps {
  /** Hacia dónde apuntan los chevrons */
  direction: ChevronDirection
  /**
   * When true, triggers the exit animation: the chevrons slide and fade out
   * (e.g. when navigating between auth screens).
   */
  exiting?: boolean
}

const rotationByDirection: Record<ChevronDirection, number> = {
  right: 0,
  left: 180,
  up: -90,
}

/**
 * Brand chevrons without glow/fusion. Motion uses one GPU-composited wrapper.
 */
const LIGHT_CHEVRON_START = '#5F8F82'
const LIGHT_CHEVRON_END = '#B7D94A'
const DARK_CHEVRON_START = '#143D36'
const DARK_CHEVRON_END = '#6B8F18'

function ChevronAccent({ direction, exiting = false }: ChevronAccentProps) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const start = isDark ? DARK_CHEVRON_START : LIGHT_CHEVRON_START
  const end = isDark ? DARK_CHEVRON_END : LIGHT_CHEVRON_END
  const gradientId = 'authChevronGradient'

  return (
    <Box
      aria-hidden="true"
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `rotate(${rotationByDirection[direction]}deg)`,
        pointerEvents: 'none',
        isolation: 'isolate',
        '@media (prefers-reduced-motion: reduce)': {
          '& .chev-motion': {
            animation: 'none !important',
          },
        },
      }}
    >
      <Box
        className="chev-motion"
        sx={{
          width: '100%',
          height: '100%',
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
          transform: 'translate3d(0,0,0)',
          '@keyframes chevronEnter': {
            from: {
              transform: 'translate3d(-8%, 0, 0)',
              opacity: 0,
            },
            to: {
              transform: 'translate3d(0, 0, 0)',
              opacity: 1,
            },
          },
          '@keyframes chevronExit': {
            from: {
              transform: 'translate3d(0, 0, 0)',
              opacity: 1,
            },
            to: {
              transform: 'translate3d(18%, 0, 0)',
              opacity: 0,
            },
          },
          animation: exiting
            ? 'chevronExit 0.3s cubic-bezier(0.33, 1, 0.68, 1) forwards'
            : 'chevronEnter 0.34s cubic-bezier(0.22, 1, 0.36, 1) both',
        }}
      >
        <Box
          component="svg"
          viewBox="-50 -30 280 260"
          sx={{
            width: '100%',
            height: '100%',
            overflow: 'visible',
            '& .chev': {
              fill: 'none',
              strokeWidth: 34,
              strokeLinecap: 'square',
              strokeLinejoin: 'miter',
            },
          }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={start} />
              <stop offset="100%" stopColor={end} />
            </linearGradient>
          </defs>

          {/* Single ribbon — no glow layer / no translucent overlap fusion. */}
          <path
            className="chev"
            d="M 40 -25 L 225 100 L 40 225"
            stroke={`url(#${gradientId})`}
          />
          <path
            className="chev"
            d="M -45 5 L 165 100 L -45 195"
            stroke={`url(#${gradientId})`}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default ChevronAccent

import { useId, type SVGProps } from 'react'
import type { AppLocale } from '@/dictionaries'

interface LocaleFlagProps extends SVGProps<SVGSVGElement> {
  locale: AppLocale
}

const FLAG_SIZE = 18

/**
 * Compact circular flag marks for locale options (CO / US / BR).
 */
function LocaleFlag({ locale, ...props }: LocaleFlagProps) {
  const clipId = useId()
  if (locale === 'es') {
    return (
      <svg
        width={FLAG_SIZE}
        height={FLAG_SIZE}
        viewBox="0 0 18 18"
        aria-hidden
        {...props}
      >
        <clipPath id={clipId}>
          <circle cx="9" cy="9" r="9" />
        </clipPath>
        <g clipPath={`url(#${clipId})`}>
          <rect width="18" height="9" y="0" fill="#FCD116" />
          <rect width="18" height="4.5" y="9" fill="#003893" />
          <rect width="18" height="4.5" y="13.5" fill="#CE1126" />
        </g>
      </svg>
    )
  }
  if (locale === 'en') {
    return (
      <svg
        width={FLAG_SIZE}
        height={FLAG_SIZE}
        viewBox="0 0 18 18"
        aria-hidden
        {...props}
      >
        <clipPath id={clipId}>
          <circle cx="9" cy="9" r="9" />
        </clipPath>
        <g clipPath={`url(#${clipId})`}>
          <rect width="18" height="18" fill="#B22234" />
          <rect y="1.38" width="18" height="1.38" fill="#FFFFFF" />
          <rect y="4.15" width="18" height="1.38" fill="#FFFFFF" />
          <rect y="6.92" width="18" height="1.38" fill="#FFFFFF" />
          <rect y="9.69" width="18" height="1.38" fill="#FFFFFF" />
          <rect y="12.46" width="18" height="1.38" fill="#FFFFFF" />
          <rect y="15.23" width="18" height="1.38" fill="#FFFFFF" />
          <rect width="9.5" height="9.5" fill="#3C3B6E" />
          <circle cx="2.2" cy="2.2" r="0.55" fill="#FFFFFF" />
          <circle cx="4.7" cy="2.2" r="0.55" fill="#FFFFFF" />
          <circle cx="7.2" cy="2.2" r="0.55" fill="#FFFFFF" />
          <circle cx="3.45" cy="3.8" r="0.55" fill="#FFFFFF" />
          <circle cx="5.95" cy="3.8" r="0.55" fill="#FFFFFF" />
          <circle cx="2.2" cy="5.4" r="0.55" fill="#FFFFFF" />
          <circle cx="4.7" cy="5.4" r="0.55" fill="#FFFFFF" />
          <circle cx="7.2" cy="5.4" r="0.55" fill="#FFFFFF" />
          <circle cx="3.45" cy="7" r="0.55" fill="#FFFFFF" />
          <circle cx="5.95" cy="7" r="0.55" fill="#FFFFFF" />
        </g>
      </svg>
    )
  }
  return (
    <svg
      width={FLAG_SIZE}
      height={FLAG_SIZE}
      viewBox="0 0 18 18"
      aria-hidden
      {...props}
    >
      <clipPath id={clipId}>
        <circle cx="9" cy="9" r="9" />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        <rect width="18" height="18" fill="#009C3B" />
        <polygon points="9,2.2 15.8,9 9,15.8 2.2,9" fill="#FFDF00" />
        <circle cx="9" cy="9" r="3.1" fill="#002776" />
        <path
          d="M6.2 8.6c1.1-0.7 2.4-1 3.7-0.85 0.8 0.1 1.5 0.35 2.2 0.7"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="0.7"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}

export default LocaleFlag

import type { ReactNode } from 'react'

export interface NavItem {
  id: string
  /** i18n key under `common/nav` (e.g. `items.inicio`). */
  titleKey: string
  url: string
  icon: ReactNode
}

export const DEFAULT_ITEMS: NavItem[] = [
  {
    id: 'inicio',
    titleKey: 'items.inicio',
    url: '/inicio',
    icon: (
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="3"
          y="3"
          width="8"
          height="8"
          rx="2.2"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <rect
          x="13"
          y="3"
          width="8"
          height="8"
          rx="2.2"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <rect
          x="3"
          y="13"
          width="8"
          height="8"
          rx="2.2"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <rect
          x="13"
          y="13"
          width="8"
          height="8"
          rx="2.2"
          stroke="currentColor"
          strokeWidth="1.75"
        />
      </svg>
    ),
  },

  {
    id: 'pagos',
    titleKey: 'items.pagos',
    url: '/pagos',
    icon: (
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="2"
          y="5"
          width="20"
          height="14"
          rx="2.8"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <line
          x1="2"
          y1="10"
          x2="22"
          y2="10"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <line
          x1="5.5"
          y1="15"
          x2="9.5"
          y2="15"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    ),
  },

  {
    id: 'reportes',
    titleKey: 'items.reportes',
    url: '/reportes',
    icon: (
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 19V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        <path
          d="M8 15v-3M12 15V9M16 15v-5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    ),
  },

  {
    id: 'prestamos',
    titleKey: 'items.prestamos',
    url: '/loans',
    icon: (
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="3"
          y="4"
          width="18"
          height="16"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <path
          d="M7 8h10M7 12h6M7 16h4"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    ),
  },

  {
    id: 'rutas',
    titleKey: 'items.rutas',
    url: '/routes',
    icon: (
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="6"
          cy="6"
          r="2.5"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <circle
          cx="18"
          cy="18"
          r="2.5"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <path
          d="M8.5 6H12c3.3 0 6 2.7 6 6v3.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M18 15.5v-2"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
]

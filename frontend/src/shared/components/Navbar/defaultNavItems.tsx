import type { ReactNode } from 'react';

export interface NavItem {
  id: string;
  title: string;
  url: string;
  icon: ReactNode;
}

export const DEFAULT_ITEMS: NavItem[] = [
  {
    id: 'inicio',
    title: 'Overview',
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
    title: 'Pagos',
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
    title: 'Reportes',
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
    id: 'configuraciones',
    title: 'Configuraciones',
    url: '/configuraciones',
    icon: (
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="3.1"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <path
          d="M19.4 13.5c.06-.49.1-.99.1-1.5s-.04-1.01-.1-1.5l2.02-1.58a.5.5 0 0 0 .12-.63l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.4 7.4 0 0 0-1.3-.75l-.36-2.54a.49.49 0 0 0-.5-.42h-3.84a.49.49 0 0 0-.5.42l-.36 2.54c-.47.2-.9.45-1.3.75l-2.39-.96a.5.5 0 0 0-.6.22L2.56 8.29a.5.5 0 0 0 .12.63L4.7 10.5c-.06.49-.1.99-.1 1.5s.04 1.01.1 1.5l-2.02 1.58a.5.5 0 0 0-.12.63l1.92 3.32c.13.22.4.31.6.22l2.39-.96c.4.3.83.55 1.3.75l.36 2.54c.04.24.25.42.5.42h3.84c.25 0 .46-.18.5-.42l.36-2.54c.47-.2.9-.45 1.3-.75l2.39.96c.2.09.47 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.63L19.4 13.5Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },

  {
    id: 'prestamos',
    title: 'Préstamos',
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
    title: 'Rutas',
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
];

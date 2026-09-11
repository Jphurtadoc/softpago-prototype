import type { DebtCollector } from '@/features/debt-collectors/types/debt-collectors.types'
import type { Loan } from '@/features/loans/types/loans.types'
import type { Route } from '@/features/routes/types/routes.types'
import type { SystemUser } from '@/features/users/types/users.types'

/** Prototype demo credentials for Vercel (no backend). */
export const PROTOTYPE_CREDENTIALS = {
  email: 'root@answertic.co',
  password: '$Admin123$',
} as const

export const PROTOTYPE_LENDER_ID = 'lender-001'

export const PROTOTYPE_USER = {
  sub: 'user-root-001',
  name: 'Juan',
  email: PROTOTYPE_CREDENTIALS.email,
  role: 'ADMIN',
  permissions: ['*'],
  lenderId: PROTOTYPE_LENDER_ID,
} as const

const NOW = '2026-09-10T12:00:00.000Z'

const seedDebtCollectors: DebtCollector[] = [
  {
    id: 'collector-001',
    lenderId: PROTOTYPE_LENDER_ID,
    name: 'Carlos Méndez',
    email: 'carlos.mendez@example.com',
    phone: '+57 300 111 2233',
    routeIds: ['route-001'],
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'collector-002',
    lenderId: PROTOTYPE_LENDER_ID,
    name: 'Ana Ruiz',
    email: 'ana.ruiz@example.com',
    phone: '+57 301 444 5566',
    routeIds: ['route-002'],
    createdAt: NOW,
    updatedAt: NOW,
  },
]

const seedUsers: SystemUser[] = [
  {
    id: PROTOTYPE_USER.sub,
    name: PROTOTYPE_USER.name,
    email: PROTOTYPE_USER.email,
    role: 'ADMIN',
    status: 'ACTIVE',
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'user-002',
    name: 'María Gómez',
    email: 'maria.gomez@answertic.co',
    role: 'MANAGER',
    status: 'ACTIVE',
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'user-003',
    name: 'Carlos Méndez',
    email: 'carlos.mendez@example.com',
    role: 'COLLECTOR',
    status: 'ACTIVE',
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'user-004',
    name: 'Ana Ruiz',
    email: 'ana.ruiz@example.com',
    role: 'COLLECTOR',
    status: 'ACTIVE',
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'user-005',
    name: 'Luis Pérez',
    email: 'luis.perez@answertic.co',
    role: 'VIEWER',
    status: 'ACTIVE',
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'user-006',
    name: 'Sofía Castro',
    email: 'sofia.castro@answertic.co',
    role: 'VIEWER',
    status: 'INACTIVE',
    createdAt: NOW,
    updatedAt: NOW,
  },
]

const seedLoans: Loan[] = [
  {
    id: 'loan-001',
    lenderId: PROTOTYPE_LENDER_ID,
    borrowerId: 'borrower-001',
    routeId: 'route-001',
    debtCollectorId: 'collector-001',
    amount: 1_000_000,
    interestType: 'FIXED',
    interestRate: 10,
    totalAmount: 1_100_000,
    installmentAmount: 110_000,
    numberOfInstallments: 10,
    paidInstallments: 3,
    frequency: 'WEEKLY',
    status: 'ACTIVE',
    startDate: '2026-08-01',
    dueDate: '2026-10-10',
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'loan-002',
    lenderId: PROTOTYPE_LENDER_ID,
    borrowerId: 'borrower-002',
    routeId: 'route-001',
    debtCollectorId: 'collector-001',
    amount: 500_000,
    interestType: 'PERIODIC',
    interestRate: 5,
    totalAmount: 550_000,
    installmentAmount: 55_000,
    numberOfInstallments: 10,
    paidInstallments: 1,
    frequency: 'WEEKLY',
    status: 'ACTIVE',
    startDate: '2026-08-15',
    dueDate: '2026-10-24',
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'loan-003',
    lenderId: PROTOTYPE_LENDER_ID,
    borrowerId: 'borrower-003',
    routeId: 'route-002',
    debtCollectorId: 'collector-002',
    amount: 2_000_000,
    interestType: 'FIXED',
    interestRate: 12,
    totalAmount: 2_240_000,
    installmentAmount: 280_000,
    numberOfInstallments: 8,
    paidInstallments: 8,
    frequency: 'BIWEEKLY',
    status: 'PAID',
    startDate: '2026-05-01',
    dueDate: '2026-08-20',
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'loan-004',
    lenderId: PROTOTYPE_LENDER_ID,
    borrowerId: 'borrower-004',
    debtCollectorId: 'collector-002',
    amount: 750_000,
    interestType: 'FIXED',
    interestRate: 8,
    totalAmount: 810_000,
    installmentAmount: 81_000,
    numberOfInstallments: 10,
    paidInstallments: 0,
    frequency: 'MONTHLY',
    status: 'OVERDUE',
    startDate: '2026-06-01',
    dueDate: '2026-08-01',
    createdAt: NOW,
    updatedAt: NOW,
  },
]

const seedRoutes: Route[] = [
  {
    id: 'route-001',
    lenderId: PROTOTYPE_LENDER_ID,
    name: 'Ruta Centro',
    description: 'Cobros zona centro y alrededores',
    debtCollectors: ['collector-001'],
    loans: [
      { loanId: 'loan-001', borrowerName: 'Juan Pérez', amount: 1_000_000 },
      { loanId: 'loan-002', borrowerName: 'María Gómez', amount: 500_000 },
    ],
    loanCount: 2,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'route-002',
    lenderId: PROTOTYPE_LENDER_ID,
    name: 'Ruta Norte',
    description: 'Cobros sector norte',
    debtCollectors: ['collector-002'],
    loans: [
      { loanId: 'loan-003', borrowerName: 'Luis Torres', amount: 2_000_000 },
    ],
    loanCount: 1,
    createdAt: NOW,
    updatedAt: NOW,
  },
]

interface PrototypeStore {
  debtCollectors: DebtCollector[]
  loans: Loan[]
  routes: Route[]
  users: SystemUser[]
}

const store: PrototypeStore = {
  debtCollectors: structuredClone(seedDebtCollectors),
  loans: structuredClone(seedLoans),
  routes: structuredClone(seedRoutes),
  users: structuredClone(seedUsers),
}

/**
 * Returns the in-memory prototype store (mutated by mock services).
 */
export function getPrototypeStore(): PrototypeStore {
  return store
}

/**
 * Builds a client-decodable mock JWT for layout/email display.
 */
export function createPrototypeAccessToken(): string {
  const encode = (value: object): string =>
    btoa(JSON.stringify(value))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '')

  return `${encode({ alg: 'none', typ: 'JWT' })}.${encode(PROTOTYPE_USER)}.prototype`
}

export interface PaginationInput {
  page?: number
  limit?: number
}

export interface PaginatedResult<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

/**
 * Paginates an in-memory list for mock list endpoints.
 */
export function paginateItems<T>(
  items: readonly T[],
  { page = 1, limit = 10 }: PaginationInput = {},
): PaginatedResult<T> {
  const safePage = Math.max(1, page)
  const safeLimit = Math.max(1, limit)
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / safeLimit))
  const start = (safePage - 1) * safeLimit

  return {
    data: items.slice(start, start + safeLimit),
    meta: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages,
    },
  }
}

/**
 * Creates a unique id for prototype CRUD operations.
 */
export function createPrototypeId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`
}

/**
 * Returns the current ISO timestamp for mock records.
 */
export function getPrototypeNow(): string {
  return new Date().toISOString()
}

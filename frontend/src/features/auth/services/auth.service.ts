import type { LoginRequest, LoginResponse } from '../types/auth.types'

import {
  createPrototypeAccessToken,
  PROTOTYPE_CREDENTIALS,
} from '@/mocks/prototype-store'

const ACCESS_TOKEN_KEY = 'accessToken'

export interface AuthenticatedUser {
  sub: string
  name?: string
  email: string
  role: string
  permissions: string[]
  lenderId?: string
}

export class AuthApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'AuthApiError'
    this.status = status
  }
}

/**
 * Authenticates against hardcoded prototype credentials (no backend).
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const normalizedEmail = credentials.email.trim().toLowerCase()
  const isValidEmail = normalizedEmail === PROTOTYPE_CREDENTIALS.email
  const isValidPassword = credentials.password === PROTOTYPE_CREDENTIALS.password

  if (!isValidEmail || !isValidPassword) {
    throw new AuthApiError('Invalid credentials', 401)
  }

  return { accessToken: createPrototypeAccessToken() }
}

export function saveAccessToken(token: string, persistent: boolean): void {
  clearAccessToken()
  const storage = persistent ? localStorage : sessionStorage
  storage.setItem(ACCESS_TOKEN_KEY, token)
}

export function getAccessToken(): string | null {
  return (
    localStorage.getItem(ACCESS_TOKEN_KEY) ??
    sessionStorage.getItem(ACCESS_TOKEN_KEY)
  )
}

export function clearAccessToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  sessionStorage.removeItem(ACCESS_TOKEN_KEY)
}

export function getAuthenticatedUser(): AuthenticatedUser | null {
  const token = getAccessToken()
  if (!token) {
    return null
  }
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }
    const payload = parts[1]
    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/')
    const decodedPayload = decodeURIComponent(
      atob(normalizedPayload)
        .split('')
        .map(
          (character) =>
            `%${`00${character.charCodeAt(0).toString(16)}`.slice(-2)}`,
        )
        .join(''),
    )
    return JSON.parse(decodedPayload) as AuthenticatedUser
  } catch {
    return null
  }
}

export function getAuthenticatedUserEmail(): string | null {
  return getAuthenticatedUser()?.email ?? null
}

export function getAuthenticatedUserName(): string | null {
  const user = getAuthenticatedUser()
  if (!user) return null
  if (user.name?.trim()) return user.name.trim()
  const localPart = user.email.split('@')[0]
  return localPart || null
}

export function getAuthenticatedUserRole(): string | null {
  return getAuthenticatedUser()?.role ?? null
}

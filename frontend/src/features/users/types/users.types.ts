/**
 * System user roles available in the SoftPago prototype.
 */
export type SystemUserRole = 'ADMIN' | 'MANAGER' | 'COLLECTOR' | 'VIEWER'

/**
 * Account status for a system user.
 */
export type SystemUserStatus = 'ACTIVE' | 'INACTIVE'

/**
 * Platform user managed from settings.
 */
export interface SystemUser {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly role: SystemUserRole
  readonly status: SystemUserStatus
  readonly createdAt: string
  readonly updatedAt: string
}

export interface GetUsersParams {
  readonly page?: number
  readonly limit?: number
  readonly search?: string
  readonly role?: SystemUserRole | ''
  readonly status?: SystemUserStatus | ''
}

export interface PaginatedUsersResponse {
  readonly data: SystemUser[]
  readonly meta: {
    readonly page: number
    readonly limit: number
    readonly total: number
    readonly totalPages: number
  }
}

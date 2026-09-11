import type {
  GetLoansParams,
  PaginatedLoansResponse,
} from '../types/routes.types'

import { loansService as coreLoansService } from '@/features/loans/services/loans.service'

/**
 * Route-feature loans adapter over the shared prototype loans store.
 */
export const loansService = {
  async getLoans(params: GetLoansParams = {}): Promise<PaginatedLoansResponse> {
    return coreLoansService.getLoans({
      page: params.page,
      limit: params.limit,
      search: params.search,
      borrowerId: params.borrowerId,
      routeId: params.routeId,
      debtCollectorId: params.debtCollectorId,
      status: params.status as
        | 'ACTIVE'
        | 'PAID'
        | 'OVERDUE'
        | 'CANCELLED'
        | undefined,
      frequency: params.frequency as
        | 'DAILY'
        | 'WEEKLY'
        | 'BIWEEKLY'
        | 'MONTHLY'
        | undefined,
      interestType: params.interestType as 'FIXED' | 'PERIODIC' | undefined,
      sortBy: params.sortBy,
      order: params.order,
    })
  },

  async getAvailableLoans(): Promise<PaginatedLoansResponse> {
    return this.getLoans({
      page: 1,
      limit: 100,
      sortBy: 'createdAt',
      order: 'desc',
    })
  },
}

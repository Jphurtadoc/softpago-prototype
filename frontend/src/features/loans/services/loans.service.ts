import type {
  CreateLoanRequest,
  DeleteLoanResponse,
  GetLoansParams,
  Loan,
  PaginatedLoansResponse,
  UpdateLoanRequest,
} from '../types/loans.types'

import {
  createPrototypeId,
  getPrototypeNow,
  getPrototypeStore,
  paginateItems,
  PROTOTYPE_LENDER_ID,
} from '@/mocks/prototype-store'

function filterLoans(params: GetLoansParams): Loan[] {
  const store = getPrototypeStore()
  return store.loans.filter((loan) => {
    if (params.lenderId && loan.lenderId !== params.lenderId) {
      return false
    }
    if (params.borrowerId && loan.borrowerId !== params.borrowerId) {
      return false
    }
    if (params.routeId && loan.routeId !== params.routeId) {
      return false
    }
    if (params.debtCollectorId && loan.debtCollectorId !== params.debtCollectorId) {
      return false
    }
    if (params.status && loan.status !== params.status) {
      return false
    }
    if (params.frequency && loan.frequency !== params.frequency) {
      return false
    }
    if (params.interestType && loan.interestType !== params.interestType) {
      return false
    }
    if (params.search) {
      const query = params.search.toLowerCase()
      const haystack = `${loan.id} ${loan.borrowerId}`.toLowerCase()
      if (!haystack.includes(query)) {
        return false
      }
    }
    return true
  })
}

function sortLoans(
  loans: Loan[],
  sortBy: string = 'createdAt',
  order: 'asc' | 'desc' = 'desc',
): Loan[] {
  const direction = order === 'asc' ? 1 : -1
  return [...loans].sort((left, right) => {
    const leftValue = String(left[sortBy as keyof Loan] ?? '')
    const rightValue = String(right[sortBy as keyof Loan] ?? '')
    return leftValue.localeCompare(rightValue) * direction
  })
}

export const loansService = {
  async getLoans(params: GetLoansParams = {}): Promise<PaginatedLoansResponse> {
    const filtered = filterLoans(params)
    const sorted = sortLoans(filtered, params.sortBy, params.order)
    return paginateItems(sorted, { page: params.page, limit: params.limit })
  },

  async getLoanById(id: string): Promise<Loan> {
    const loan = getPrototypeStore().loans.find((item) => item.id === id)
    if (!loan) {
      throw new Error('Loan not found')
    }
    return loan
  },

  async createLoan(data: CreateLoanRequest): Promise<Loan> {
    const now = getPrototypeNow()
    const loan: Loan = {
      id: createPrototypeId('loan'),
      lenderId: PROTOTYPE_LENDER_ID,
      borrowerId: data.borrowerId,
      routeId: data.routeId,
      debtCollectorId: data.debtCollectorId,
      amount: data.amount,
      interestType: data.interestType,
      interestRate: data.interestRate,
      totalAmount: data.totalAmount,
      installmentAmount: data.installmentAmount,
      numberOfInstallments: data.numberOfInstallments,
      paidInstallments: data.paidInstallments ?? 0,
      frequency: data.frequency,
      status: data.status ?? 'ACTIVE',
      startDate: data.startDate,
      dueDate: data.dueDate,
      createdAt: now,
      updatedAt: now,
    }
    getPrototypeStore().loans.unshift(loan)
    return loan
  },

  async updateLoan(id: string, data: UpdateLoanRequest): Promise<Loan> {
    const store = getPrototypeStore()
    const index = store.loans.findIndex((item) => item.id === id)
    if (index < 0) {
      throw new Error('Loan not found')
    }
    const updated: Loan = {
      ...store.loans[index],
      ...data,
      updatedAt: getPrototypeNow(),
    }
    store.loans[index] = updated
    return updated
  },

  async deleteLoan(id: string): Promise<DeleteLoanResponse> {
    const store = getPrototypeStore()
    const index = store.loans.findIndex((item) => item.id === id)
    if (index < 0) {
      throw new Error('Loan not found')
    }
    store.loans.splice(index, 1)
    store.routes.forEach((route) => {
      route.loans = route.loans.filter((item) => item.loanId !== id)
      route.loanCount = route.loans.length
    })
    return { message: 'Loan deleted' }
  },
}

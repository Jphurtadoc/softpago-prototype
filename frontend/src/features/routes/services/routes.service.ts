import type {
  AddRouteLoanRequest,
  CreateRouteRequest,
  DeleteResponse,
  GetRoutesParams,
  PaginatedRoutesResponse,
  Route,
  UpdateRouteLoanRequest,
  UpdateRouteRequest,
} from '../types/routes.types'

import {
  createPrototypeId,
  getPrototypeNow,
  getPrototypeStore,
  paginateItems,
  PROTOTYPE_LENDER_ID,
} from '@/mocks/prototype-store'

function filterRoutes(params: GetRoutesParams): Route[] {
  const store = getPrototypeStore()
  return store.routes.filter((route) => {
    if (params.search) {
      const query = params.search.toLowerCase()
      const haystack = `${route.name} ${route.description ?? ''}`.toLowerCase()
      if (!haystack.includes(query)) return false
    }
    if (typeof params.hasLoans === 'boolean') {
      const routeHasLoans = route.loanCount > 0
      if (routeHasLoans !== params.hasLoans) return false
    }
    if (typeof params.hasCollectors === 'boolean') {
      const routeHasCollectors = route.debtCollectors.length > 0
      if (routeHasCollectors !== params.hasCollectors) return false
    }
    return true
  })
}

function sortRoutes(
  routes: Route[],
  sortBy: GetRoutesParams['sortBy'] = 'createdAt',
  order: 'asc' | 'desc' = 'desc',
): Route[] {
  const direction = order === 'asc' ? 1 : -1
  return [...routes].sort((left, right) => {
    const leftValue = String(left[sortBy] ?? '')
    const rightValue = String(right[sortBy] ?? '')
    return leftValue.localeCompare(rightValue) * direction
  })
}

export const routesService = {
  async getRoutes(
    params: GetRoutesParams = {},
  ): Promise<PaginatedRoutesResponse> {
    const filtered = filterRoutes(params)
    const sorted = sortRoutes(filtered, params.sortBy, params.order)
    return paginateItems(sorted, { page: params.page, limit: params.limit })
  },

  async getRouteById(id: string): Promise<Route> {
    const route = getPrototypeStore().routes.find((item) => item.id === id)
    if (!route) {
      throw new Error('Route not found')
    }
    return route
  },

  async createRoute(data: CreateRouteRequest): Promise<Route> {
    const now = getPrototypeNow()
    const route: Route = {
      id: createPrototypeId('route'),
      lenderId: data.lenderId ?? PROTOTYPE_LENDER_ID,
      name: data.name,
      description: data.description,
      debtCollectors: data.debtCollectors,
      loans: [],
      loanCount: 0,
      createdAt: now,
      updatedAt: now,
    }
    getPrototypeStore().routes.unshift(route)
    return route
  },

  async updateRoute(id: string, data: UpdateRouteRequest): Promise<Route> {
    const store = getPrototypeStore()
    const index = store.routes.findIndex((item) => item.id === id)
    if (index < 0) {
      throw new Error('Route not found')
    }
    const updated: Route = {
      ...store.routes[index],
      ...data,
      updatedAt: getPrototypeNow(),
    }
    store.routes[index] = updated
    return updated
  },

  async deleteRoute(id: string): Promise<DeleteResponse> {
    const store = getPrototypeStore()
    const index = store.routes.findIndex((item) => item.id === id)
    if (index < 0) {
      throw new Error('Route not found')
    }
    store.routes.splice(index, 1)
    return { message: 'Route deleted' }
  },

  async addLoan(routeId: string, data: AddRouteLoanRequest): Promise<Route> {
    const store = getPrototypeStore()
    const route = store.routes.find((item) => item.id === routeId)
    if (!route) {
      throw new Error('Route not found')
    }
    const loan = store.loans.find((item) => item.id === data.loanId)
    if (!loan) {
      throw new Error('Loan not found')
    }
    const alreadyLinked = route.loans.some((item) => item.loanId === data.loanId)
    if (!alreadyLinked) {
      route.loans.push({
        loanId: loan.id,
        borrowerName: loan.borrowerId,
        amount: loan.amount,
      })
      route.loanCount = route.loans.length
      route.updatedAt = getPrototypeNow()
      loan.routeId = routeId
      loan.updatedAt = getPrototypeNow()
    }
    return route
  },

  async updateLoan(
    routeId: string,
    loanId: string,
    data: UpdateRouteLoanRequest,
  ): Promise<Route> {
    const store = getPrototypeStore()
    const route = store.routes.find((item) => item.id === routeId)
    if (!route) {
      throw new Error('Route not found')
    }
    const routeLoan = route.loans.find((item) => item.loanId === loanId)
    if (!routeLoan) {
      throw new Error('Loan not found on route')
    }
    routeLoan.amount = data.amount
    route.updatedAt = getPrototypeNow()
    const loan = store.loans.find((item) => item.id === loanId)
    if (loan) {
      loan.amount = data.amount
      loan.updatedAt = getPrototypeNow()
    }
    return route
  },

  async removeLoan(routeId: string, loanId: string): Promise<DeleteResponse> {
    const store = getPrototypeStore()
    const route = store.routes.find((item) => item.id === routeId)
    if (!route) {
      throw new Error('Route not found')
    }
    route.loans = route.loans.filter((item) => item.loanId !== loanId)
    route.loanCount = route.loans.length
    route.updatedAt = getPrototypeNow()
    const loan = store.loans.find((item) => item.id === loanId)
    if (loan?.routeId === routeId) {
      loan.routeId = undefined
      loan.updatedAt = getPrototypeNow()
    }
    return { message: 'Loan removed from route' }
  },
}

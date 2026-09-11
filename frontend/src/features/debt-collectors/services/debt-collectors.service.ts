import type {
  DebtCollector,
  GetDebtCollectorsParams,
  PaginatedDebtCollectorsResponse,
} from '../types/debt-collectors.types'

import {
  getPrototypeStore,
  paginateItems,
} from '@/mocks/prototype-store'

function filterDebtCollectors(params: GetDebtCollectorsParams): DebtCollector[] {
  const store = getPrototypeStore()
  if (!params.search) {
    return store.debtCollectors
  }
  const query = params.search.toLowerCase()
  return store.debtCollectors.filter((collector) => {
    const haystack =
      `${collector.name} ${collector.email} ${collector.phone}`.toLowerCase()
    return haystack.includes(query)
  })
}

function sortDebtCollectors(
  collectors: DebtCollector[],
  sortBy: string = 'name',
  order: 'asc' | 'desc' = 'asc',
): DebtCollector[] {
  const direction = order === 'asc' ? 1 : -1
  return [...collectors].sort((left, right) => {
    const leftValue = String(left[sortBy as keyof DebtCollector] ?? '')
    const rightValue = String(right[sortBy as keyof DebtCollector] ?? '')
    return leftValue.localeCompare(rightValue) * direction
  })
}

export const debtCollectorsService = {
  async getDebtCollectors(
    params: GetDebtCollectorsParams = {},
  ): Promise<PaginatedDebtCollectorsResponse> {
    const filtered = filterDebtCollectors(params)
    const sorted = sortDebtCollectors(filtered, params.sortBy, params.order)
    return paginateItems(sorted, { page: params.page, limit: params.limit })
  },

  async getAllDebtCollectors(): Promise<DebtCollector[]> {
    const response = await this.getDebtCollectors({
      page: 1,
      limit: 100,
      sortBy: 'name',
      order: 'asc',
    })
    return response.data
  },
}

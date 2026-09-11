import type {
  GetUsersParams,
  PaginatedUsersResponse,
  SystemUser,
} from '../types/users.types'
import {
  getPrototypeStore,
  paginateItems,
} from '@/mocks/prototype-store'

function filterUsers(params: GetUsersParams): SystemUser[] {
  const store = getPrototypeStore()
  let users = store.users

  if (params.role) {
    users = users.filter((user) => user.role === params.role)
  }
  if (params.status) {
    users = users.filter((user) => user.status === params.status)
  }
  if (params.search?.trim()) {
    const query = params.search.trim().toLowerCase()
    users = users.filter((user) => {
      const haystack = `${user.name} ${user.email} ${user.role}`.toLowerCase()
      return haystack.includes(query)
    })
  }

  return users
}

export const usersService = {
  /**
   * Returns a paginated list of system users for the settings table.
   */
  async getUsers(params: GetUsersParams = {}): Promise<PaginatedUsersResponse> {
    const filtered = filterUsers(params)
    const sorted = [...filtered].sort((left, right) =>
      left.name.localeCompare(right.name),
    )
    return paginateItems(sorted, { page: params.page, limit: params.limit })
  },
}

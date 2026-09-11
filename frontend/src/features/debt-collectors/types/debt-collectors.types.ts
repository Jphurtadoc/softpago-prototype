export interface DebtCollector {
  id: string;
  lenderId: string;
  name: string;
  email: string;
  phone: string;
  routeIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedDebtCollectorsResponse {
  data: DebtCollector[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetDebtCollectorsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

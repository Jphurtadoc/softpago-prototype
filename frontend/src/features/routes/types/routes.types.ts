export interface RouteLoan {
  loanId: string;
  borrowerName: string;
  amount: number;
}

export interface Route {
  id: string;
  lenderId: string;
  name: string;
  description?: string;
  debtCollectors: string[];
  loans: RouteLoan[];
  loanCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedRoutesResponse {
  data: Route[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetRoutesParams {
  page?: number;
  limit?: number;
  search?: string;
  hasLoans?: boolean;
  hasCollectors?: boolean;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  order?: 'asc' | 'desc';
}

export interface CreateRouteRequest {
  name: string;
  description?: string;
  debtCollectors: string[];
  lenderId?: string;
}

export interface UpdateRouteRequest {
  name?: string;
  description?: string;
  debtCollectors?: string[];
}

export interface AddRouteLoanRequest {
  loanId: string;
}

export interface UpdateRouteLoanRequest {
  amount: number;
}

export interface DeleteResponse {
  message: string;
}

export interface Loan {
  id: string;
  lenderId: string;
  borrowerId: string;
  routeId?: string;
  debtCollectorId?: string;
  amount: number;
  interestType: string;
  interestRate: number;
  totalAmount: number;
  installmentAmount: number;
  numberOfInstallments: number;
  paidInstallments: number;
  frequency: string;
  status: string;
  startDate: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedLoansResponse {
  data: Loan[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetLoansParams {
  page?: number;
  limit?: number;
  search?: string;
  borrowerId?: string;
  routeId?: string;
  debtCollectorId?: string;
  status?: string;
  frequency?: string;
  interestType?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

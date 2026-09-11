export type LoanInterestType = 'FIXED' | 'PERIODIC';

export type LoanFrequency = 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';

export type LoanStatus = 'ACTIVE' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface Loan {
  id: string;
  lenderId: string;
  borrowerId: string;
  routeId?: string;
  debtCollectorId?: string;

  amount: number;

  interestType: LoanInterestType;
  interestRate: number;

  totalAmount: number;
  installmentAmount: number;

  numberOfInstallments: number;
  paidInstallments: number;

  frequency: LoanFrequency;
  status: LoanStatus;

  startDate: string;
  dueDate: string;

  createdAt: string;
  updatedAt: string;
}

export interface CreateLoanRequest {
  borrowerId: string;
  routeId?: string;
  debtCollectorId?: string;

  amount: number;

  interestType: LoanInterestType;
  interestRate: number;

  totalAmount: number;
  installmentAmount: number;

  numberOfInstallments: number;
  paidInstallments?: number;

  frequency: LoanFrequency;
  status?: LoanStatus;

  startDate: string;
  dueDate: string;
}

export interface UpdateLoanRequest {
  borrowerId: string;
  routeId?: string;
  debtCollectorId?: string;

  amount: number;

  interestType: LoanInterestType;
  interestRate: number;

  totalAmount: number;
  installmentAmount: number;

  numberOfInstallments: number;
  paidInstallments: number;

  frequency: LoanFrequency;
  status: LoanStatus;

  startDate: string;
  dueDate: string;
}

export interface GetLoansParams {
  page?: number;
  limit?: number;

  search?: string;

  lenderId?: string;
  borrowerId?: string;
  routeId?: string;
  debtCollectorId?: string;

  status?: LoanStatus;
  frequency?: LoanFrequency;
  interestType?: LoanInterestType;

  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface LoansPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedLoansResponse {
  data: Loan[];
  meta: LoansPaginationMeta;
}

export interface DeleteLoanResponse {
  message: string;
}

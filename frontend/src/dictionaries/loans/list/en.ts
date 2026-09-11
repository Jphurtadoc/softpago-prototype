/** English scaffold for the loans list page. */
const loansListEn = {
  title: 'Loans',
  subtitle: 'Manage your loans and repayment schedules.',
  createLoan: 'New loan',
  searchPlaceholder: 'Search by borrower, email or Loan ID',
  empty: 'No loans found',
  loading: 'Loading…',
  confirmDelete: 'Are you sure you want to delete this loan of {{amount}}?',
  errors: {
    load: 'Unable to load loans',
    delete: 'Unable to delete loan',
  },
  columns: {
    borrower: 'Borrower',
    loanId: 'Loan ID',
    amount: 'Amount',
    interest: 'Interest',
    installment: 'Installment',
    installments: 'Installments',
    frequency: 'Frequency',
    status: 'Status',
    dueDate: 'Due date',
  },
  actions: {
    view: 'View',
    edit: 'Edit',
    delete: 'Delete',
    menu: 'Row actions',
    menuFor: 'Actions for loan {{id}}',
  },
  filters: {
    label: 'Filters',
    clear: 'Clear',
    status: 'Status',
    frequency: 'Frequency',
    interestType: 'Interest type',
  },
  tabs: {
    all: 'All',
  },
  status: {
    ACTIVE: 'Active',
    PAID: 'Paid',
    OVERDUE: 'Overdue',
    CANCELLED: 'Cancelled',
  },
  frequency: {
    DAILY: 'Daily',
    WEEKLY: 'Weekly',
    BIWEEKLY: 'Biweekly',
    MONTHLY: 'Monthly',
  },
  interestType: {
    FIXED: 'Fixed',
    PERIODIC: 'Periodic',
  },
  pagination: {
    prev: 'Prev',
    next: 'Next',
    rows: 'Rows',
    range: '{{start}}–{{end}} of {{total}}',
    selected: '{{count}} selected',
  },
} as const

export default loansListEn

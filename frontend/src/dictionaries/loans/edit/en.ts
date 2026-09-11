/** English copy for the loan edit page. */
const loansEditEn = {
  title: 'Edit loan',
  subtitle: 'Update the loan information and repayment schedule.',
  loading: 'Loading loan…',
  missingId: 'Loan ID is missing',
  backToList: 'Back to loans',
  cancel: 'Cancel',
  save: 'Save changes',
  saving: 'Saving…',
  back: 'Back',
  sections: {
    parties: 'Parties',
    partiesDesc: 'Borrower, route, and collector.',
    financial: 'Financial',
    financialDesc: 'Amounts and interest.',
    schedule: 'Schedule',
    scheduleDesc: 'Frequency, status, and dates.',
  },
  fields: {
    borrowerId: 'Borrower ID',
    routeId: 'Route ID',
    debtCollectorId: 'Debt collector ID',
    amount: 'Amount',
    interestType: 'Interest type',
    interestRate: 'Interest rate (%)',
    totalAmount: 'Total amount',
    installmentAmount: 'Installment amount',
    numberOfInstallments: 'Number of installments',
    paidInstallments: 'Paid installments',
    frequency: 'Frequency',
    status: 'Status',
    startDate: 'Start date',
    dueDate: 'Due date',
  },
  errors: {
    load: 'Unable to load loan',
    update: 'Unable to update loan',
    borrowerRequired: 'Borrower ID is required',
  },
} as const

export default loansEditEn

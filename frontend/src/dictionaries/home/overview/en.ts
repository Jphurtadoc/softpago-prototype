/** English copy for the Overview (home) dashboard. */
const homeOverviewEn = {
  welcome: 'Hello, {{name}}',
  subtitle: 'A quick look at your operation.',
  loadError: 'Unable to load the dashboard.',
  activeBalance: {
    title: 'Active balance',
    transfer: 'View routes',
    request: 'View loans',
    show: 'Show balance',
    hide: 'Hide balance',
  },
  balance: {
    title: 'Balance',
    badge: '+{{percent}}% this month',
    dayStart: 'Day start',
    paymentsToday: 'Payments today',
    showMetric: 'Show {{label}}',
    hideMetric: 'Hide {{label}}',
    openPayments: 'Go to payments',
    currency: 'COP',
  },
  quickActions: {
    title: 'Quick actions',
    createRoute: 'Create new route',
    manageRoutes: 'Manage routes',
    manageLoans: 'Manage loans',
  },
  alerts: {
    title: 'Alerts',
    open: 'Go to reports',
    emptyTitle: 'No alerts',
    emptyDescription: 'Everything looks fine for now.',
    overdueClient: 'Client with overdue payment',
    overdueDetail: '{{name}} · late installment',
    approve: 'Confirm alert',
    decline: 'Dismiss alert',
    viewDetails: 'View details',
  },
  transactions: {
    title: 'Recent transactions',
    empty: 'No pending activity.',
    open: 'Go to payments',
    viewAll: 'View all transactions',
  },
} as const

export default homeOverviewEn

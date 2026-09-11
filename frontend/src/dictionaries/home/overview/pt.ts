/** Portuguese copy for the Overview (home) dashboard. */
const homeOverviewPt = {
  welcome: 'Olá, {{name}}',
  subtitle: 'Visão geral da sua operação.',
  loadError: 'Não foi possível carregar o painel.',
  activeBalance: {
    title: 'Saldo ativo',
    transfer: 'Ver rotas',
    request: 'Ver empréstimos',
    show: 'Mostrar saldo',
    hide: 'Ocultar saldo',
  },
  balance: {
    title: 'Saldo',
    badge: '+{{percent}}% este mês',
    dayStart: 'Início do dia',
    paymentsToday: 'Pagamentos hoje',
    showMetric: 'Mostrar {{label}}',
    hideMetric: 'Ocultar {{label}}',
    openPayments: 'Ir para pagamentos',
    currency: 'COP',
  },
  quickActions: {
    title: 'Ações rápidas',
    createRoute: 'Criar nova rota',
    manageRoutes: 'Gerenciar rotas',
    manageLoans: 'Gerenciar empréstimos',
  },
  alerts: {
    title: 'Alertas',
    open: 'Ir para relatórios',
    emptyTitle: 'Sem alertas',
    emptyDescription: 'Tudo em ordem por enquanto.',
    overdueClient: 'Cliente com pagamento vencido',
    overdueDetail: '{{name}} · parcela atrasada',
    approve: 'Confirmar alerta',
    decline: 'Descartar alerta',
    viewDetails: 'Ver detalhes',
  },
  transactions: {
    title: 'Transações recentes',
    empty: 'Nenhuma atividade pendente.',
    open: 'Ir para pagamentos',
    viewAll: 'Ver todas as transações',
  },
} as const

export default homeOverviewPt

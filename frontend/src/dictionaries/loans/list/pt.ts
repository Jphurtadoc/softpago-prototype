/** Portuguese scaffold for the loans list page. */
const loansListPt = {
  title: 'Empréstimos',
  subtitle: 'Gerencie seus empréstimos e cronogramas de pagamento.',
  createLoan: 'Novo empréstimo',
  searchPlaceholder: 'Buscar por mutuário, e-mail ou ID',
  empty: 'Nenhum empréstimo encontrado',
  loading: 'Carregando…',
  confirmDelete: 'Tem certeza de que deseja excluir este empréstimo de {{amount}}?',
  errors: {
    load: 'Não foi possível carregar os empréstimos',
    delete: 'Não foi possível excluir o empréstimo',
  },
  columns: {
    borrower: 'Mutuário',
    loanId: 'ID do empréstimo',
    amount: 'Valor',
    interest: 'Juros',
    installment: 'Parcela',
    installments: 'Parcelas',
    frequency: 'Frequência',
    status: 'Status',
    dueDate: 'Vencimento',
  },
  actions: {
    view: 'Ver',
    edit: 'Editar',
    delete: 'Excluir',
    menu: 'Ações da linha',
    menuFor: 'Ações do empréstimo {{id}}',
  },
  filters: {
    label: 'Filtros',
    clear: 'Limpar',
    status: 'Status',
    frequency: 'Frequência',
    interestType: 'Tipo de juros',
  },
  tabs: {
    all: 'Todos',
  },
  status: {
    ACTIVE: 'Ativo',
    PAID: 'Pago',
    OVERDUE: 'Atrasado',
    CANCELLED: 'Cancelado',
  },
  frequency: {
    DAILY: 'Diário',
    WEEKLY: 'Semanal',
    BIWEEKLY: 'Quinzenal',
    MONTHLY: 'Mensal',
  },
  interestType: {
    FIXED: 'Fixo',
    PERIODIC: 'Periódico',
  },
  pagination: {
    prev: 'Ant',
    next: 'Próx',
    rows: 'Linhas',
    range: '{{start}}–{{end}} de {{total}}',
    selected: '{{count}} selecionados',
  },
} as const

export default loansListPt

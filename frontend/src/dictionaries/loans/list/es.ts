/** Spanish scaffold for the loans list page. */
const loansListEs = {
  title: 'Préstamos',
  subtitle: 'Administra tus préstamos y cronogramas de pago.',
  createLoan: 'Nuevo préstamo',
  searchPlaceholder: 'Buscar por prestatario, correo o ID',
  empty: 'No se encontraron préstamos',
  loading: 'Cargando…',
  confirmDelete: '¿Seguro que quieres eliminar este préstamo de {{amount}}?',
  errors: {
    load: 'No se pudieron cargar los préstamos',
    delete: 'No se pudo eliminar el préstamo',
  },
  columns: {
    borrower: 'Prestatario',
    loanId: 'ID préstamo',
    amount: 'Monto',
    interest: 'Interés',
    installment: 'Cuota',
    installments: 'Cuotas',
    frequency: 'Frecuencia',
    status: 'Estado',
    dueDate: 'Vencimiento',
  },
  actions: {
    view: 'Ver',
    edit: 'Editar',
    delete: 'Eliminar',
    menu: 'Acciones de fila',
    menuFor: 'Acciones del préstamo {{id}}',
  },
  filters: {
    label: 'Filtros',
    clear: 'Limpiar',
    status: 'Estado',
    frequency: 'Frecuencia',
    interestType: 'Tipo de interés',
  },
  tabs: {
    all: 'Todos',
  },
  status: {
    ACTIVE: 'Activo',
    PAID: 'Pagado',
    OVERDUE: 'Vencido',
    CANCELLED: 'Cancelado',
  },
  frequency: {
    DAILY: 'Diario',
    WEEKLY: 'Semanal',
    BIWEEKLY: 'Quincenal',
    MONTHLY: 'Mensual',
  },
  interestType: {
    FIXED: 'Fijo',
    PERIODIC: 'Periódico',
  },
  pagination: {
    prev: 'Ant',
    next: 'Sig',
    rows: 'Filas',
    range: '{{start}}–{{end}} de {{total}}',
    selected: '{{count}} seleccionados',
  },
} as const

export default loansListEs

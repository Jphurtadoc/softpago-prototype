/** Spanish copy for the Overview (home) dashboard. */
const homeOverviewEs = {
  welcome: 'Hola, {{name}}',
  subtitle: 'Resumen general de tu operación.',
  loadError: 'No se pudo cargar el panel.',
  activeBalance: {
    title: 'Saldo activo',
    transfer: 'Ver rutas',
    request: 'Ver préstamos',
    show: 'Mostrar saldo',
    hide: 'Ocultar saldo',
  },
  balance: {
    title: 'Balance',
    badge: '+{{percent}}% este mes',
    dayStart: 'Inicio del día',
    paymentsToday: 'Pagos hoy',
    showMetric: 'Mostrar {{label}}',
    hideMetric: 'Ocultar {{label}}',
    openPayments: 'Ir a pagos',
    currency: 'COP',
  },
  quickActions: {
    title: 'Acciones rápidas',
    createRoute: 'Crear nueva ruta',
    manageRoutes: 'Administrar rutas',
    manageLoans: 'Administrar préstamos',
  },
  alerts: {
    title: 'Alertas',
    open: 'Ir a reportes',
    emptyTitle: 'Sin alertas',
    emptyDescription: 'Todo en orden por ahora.',
    overdueClient: 'Cliente con pago vencido',
    overdueDetail: '{{name}} · cuota atrasada',
    approve: 'Confirmar alerta',
    decline: 'Descartar alerta',
    viewDetails: 'Ver detalles',
  },
  transactions: {
    title: 'Transacciones recientes',
    empty: 'No hay movimientos pendientes.',
    open: 'Ir a pagos',
    viewAll: 'Ver todas las transacciones',
  },
} as const

export default homeOverviewEs

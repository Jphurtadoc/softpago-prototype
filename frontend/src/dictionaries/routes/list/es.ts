/** Spanish copy for the routes list page. */
const routesListEs = {
  title: 'Rutas',
  subtitle: 'Administra tus carteras de préstamos y rutas de cobro.',
  createRoute: 'Nueva ruta',
  searchPlaceholder: 'Buscar por nombre',
  empty: 'No se encontraron rutas',
  loading: 'Cargando…',
  confirmDelete: '¿Seguro que quieres eliminar la ruta "{{name}}"?',
  errors: {
    load: 'No se pudieron cargar las rutas',
    delete: 'No se pudo eliminar la ruta',
  },
  columns: {
    name: 'Nombre',
    description: 'Descripción',
    activity: 'Actividad',
    debtCollectors: 'Cobradores',
    loans: 'Préstamos',
    createdAt: 'Creada',
  },
  actions: {
    view: 'Ver',
    edit: 'Editar',
    delete: 'Eliminar',
    menu: 'Acciones de fila',
    menuFor: 'Acciones de la ruta {{name}}',
  },
  filters: {
    label: 'Filtros',
    clear: 'Limpiar',
    activity: 'Actividad',
    hasCollectors: 'Cobradores',
    withCollectors: 'Con cobradores',
    withoutCollectors: 'Sin cobradores',
  },
  tabs: {
    all: 'Todas',
  },
  activity: {
    ACTIVE: 'Con préstamos',
    EMPTY: 'Vacía',
  },
  pagination: {
    prev: 'Ant',
    next: 'Sig',
    rows: 'Filas',
    range: '{{start}}–{{end}} de {{total}}',
    selected: '{{count}} seleccionados',
  },
} as const

export default routesListEs

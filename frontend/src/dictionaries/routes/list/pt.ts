/** Portuguese copy for the routes list page. */
const routesListPt = {
  title: 'Rotas',
  subtitle: 'Gerencie suas carteiras de empréstimos e rotas de cobrança.',
  createRoute: 'Nova rota',
  searchPlaceholder: 'Buscar por nome',
  empty: 'Nenhuma rota encontrada',
  loading: 'Carregando…',
  confirmDelete: 'Tem certeza de que deseja excluir a rota "{{name}}"?',
  errors: {
    load: 'Não foi possível carregar as rotas',
    delete: 'Não foi possível excluir a rota',
  },
  columns: {
    name: 'Nome',
    description: 'Descrição',
    activity: 'Atividade',
    debtCollectors: 'Cobradores',
    loans: 'Empréstimos',
    createdAt: 'Criada',
  },
  actions: {
    view: 'Ver',
    edit: 'Editar',
    delete: 'Excluir',
    menu: 'Ações da linha',
    menuFor: 'Ações da rota {{name}}',
  },
  filters: {
    label: 'Filtros',
    clear: 'Limpar',
    activity: 'Atividade',
    hasCollectors: 'Cobradores',
    withCollectors: 'Com cobradores',
    withoutCollectors: 'Sem cobradores',
  },
  tabs: {
    all: 'Todas',
  },
  activity: {
    ACTIVE: 'Com empréstimos',
    EMPTY: 'Vazia',
  },
  pagination: {
    prev: 'Ant',
    next: 'Próx',
    rows: 'Linhas',
    range: '{{start}}–{{end}} de {{total}}',
    selected: '{{count}} selecionados',
  },
} as const

export default routesListPt

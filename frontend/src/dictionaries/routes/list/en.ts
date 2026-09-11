/** English copy for the routes list page. */
const routesListEn = {
  title: 'Routes',
  subtitle: 'Manage your loan portfolios and collection routes.',
  createRoute: 'New route',
  searchPlaceholder: 'Search by name',
  empty: 'No routes found',
  loading: 'Loading…',
  confirmDelete: 'Are you sure you want to delete the route "{{name}}"?',
  errors: {
    load: 'Unable to load routes',
    delete: 'Unable to delete route',
  },
  columns: {
    name: 'Name',
    description: 'Description',
    activity: 'Activity',
    debtCollectors: 'Debt collectors',
    loans: 'Loans',
    createdAt: 'Created',
  },
  actions: {
    view: 'View',
    edit: 'Edit',
    delete: 'Delete',
    menu: 'Row actions',
    menuFor: 'Actions for route {{name}}',
  },
  filters: {
    label: 'Filters',
    clear: 'Clear',
    activity: 'Activity',
    hasCollectors: 'Collectors',
    withCollectors: 'With collectors',
    withoutCollectors: 'Without collectors',
  },
  tabs: {
    all: 'All',
  },
  activity: {
    ACTIVE: 'With loans',
    EMPTY: 'Empty',
  },
  pagination: {
    prev: 'Prev',
    next: 'Next',
    rows: 'Rows',
    range: '{{start}}–{{end}} of {{total}}',
    selected: '{{count}} selected',
  },
} as const

export default routesListEn

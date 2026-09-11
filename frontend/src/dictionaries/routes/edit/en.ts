/** English copy for the route edit page. */
const routesEditEn = {
  title: 'Edit route',
  subtitle: 'Update the route information and assigned debt collectors.',
  loading: 'Loading route…',
  missingId: 'Route ID is missing',
  notFound: 'Route not found',
  back: 'Back',
  backToList: 'Back to routes',
  cancel: 'Cancel',
  save: 'Save changes',
  saving: 'Saving…',
  sections: {
    info: 'Information',
    infoDesc: 'Route name and description.',
    collectors: 'Collectors',
    collectorsDesc: 'Select at least one debt collector.',
  },
  fields: {
    name: 'Route name',
    description: 'Description',
    collectors: 'Debt collectors',
  },
  collectors: {
    empty: 'No debt collectors available.',
  },
  errors: {
    load: 'Unable to load route',
    update: 'Unable to update route',
    nameRequired: 'Route name is required',
    collectorsRequired: 'Select at least one debt collector',
  },
} as const

export default routesEditEn

/** Spanish copy for the route edit page. */
const routesEditEs = {
  title: 'Editar ruta',
  subtitle: 'Actualiza la información y los cobradores asignados.',
  loading: 'Cargando ruta…',
  missingId: 'Falta el ID de la ruta',
  notFound: 'Ruta no encontrada',
  back: 'Volver',
  backToList: 'Volver a rutas',
  cancel: 'Cancelar',
  save: 'Guardar cambios',
  saving: 'Guardando…',
  sections: {
    info: 'Información',
    infoDesc: 'Nombre y descripción de la ruta.',
    collectors: 'Cobradores',
    collectorsDesc: 'Selecciona al menos un cobrador.',
  },
  fields: {
    name: 'Nombre de la ruta',
    description: 'Descripción',
    collectors: 'Cobradores',
  },
  collectors: {
    empty: 'No hay cobradores disponibles.',
  },
  errors: {
    load: 'No se pudo cargar la ruta',
    update: 'No se pudo actualizar la ruta',
    nameRequired: 'El nombre de la ruta es obligatorio',
    collectorsRequired: 'Selecciona al menos un cobrador',
  },
} as const

export default routesEditEs

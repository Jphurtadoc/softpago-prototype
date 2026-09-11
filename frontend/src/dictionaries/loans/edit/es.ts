/** Spanish copy for the loan edit page. */
const loansEditEs = {
  title: 'Editar préstamo',
  subtitle: 'Actualiza la información y el cronograma de pago.',
  loading: 'Cargando préstamo…',
  missingId: 'Falta el ID del préstamo',
  backToList: 'Volver a préstamos',
  cancel: 'Cancelar',
  save: 'Guardar cambios',
  saving: 'Guardando…',
  back: 'Volver',
  sections: {
    parties: 'Partes',
    partiesDesc: 'Prestatario, ruta y cobrador.',
    financial: 'Finanzas',
    financialDesc: 'Montos e interés.',
    schedule: 'Cronograma',
    scheduleDesc: 'Frecuencia, estado y fechas.',
  },
  fields: {
    borrowerId: 'ID prestatario',
    routeId: 'ID ruta',
    debtCollectorId: 'ID cobrador',
    amount: 'Monto',
    interestType: 'Tipo de interés',
    interestRate: 'Tasa de interés (%)',
    totalAmount: 'Monto total',
    installmentAmount: 'Valor de cuota',
    numberOfInstallments: 'Número de cuotas',
    paidInstallments: 'Cuotas pagadas',
    frequency: 'Frecuencia',
    status: 'Estado',
    startDate: 'Fecha de inicio',
    dueDate: 'Fecha de vencimiento',
  },
  errors: {
    load: 'No se pudo cargar el préstamo',
    update: 'No se pudo actualizar el préstamo',
    borrowerRequired: 'El ID del prestatario es obligatorio',
  },
} as const

export default loansEditEs

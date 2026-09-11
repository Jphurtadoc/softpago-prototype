/** Portuguese copy for the loan edit page. */
const loansEditPt = {
  title: 'Editar empréstimo',
  subtitle: 'Atualize as informações e o cronograma de pagamento.',
  loading: 'Carregando empréstimo…',
  missingId: 'ID do empréstimo ausente',
  backToList: 'Voltar aos empréstimos',
  cancel: 'Cancelar',
  save: 'Salvar alterações',
  saving: 'Salvando…',
  back: 'Voltar',
  sections: {
    parties: 'Partes',
    partiesDesc: 'Mutuário, rota e cobrador.',
    financial: 'Financeiro',
    financialDesc: 'Valores e juros.',
    schedule: 'Cronograma',
    scheduleDesc: 'Frequência, status e datas.',
  },
  fields: {
    borrowerId: 'ID do mutuário',
    routeId: 'ID da rota',
    debtCollectorId: 'ID do cobrador',
    amount: 'Valor',
    interestType: 'Tipo de juros',
    interestRate: 'Taxa de juros (%)',
    totalAmount: 'Valor total',
    installmentAmount: 'Valor da parcela',
    numberOfInstallments: 'Número de parcelas',
    paidInstallments: 'Parcelas pagas',
    frequency: 'Frequência',
    status: 'Status',
    startDate: 'Data de início',
    dueDate: 'Data de vencimento',
  },
  errors: {
    load: 'Não foi possível carregar o empréstimo',
    update: 'Não foi possível atualizar o empréstimo',
    borrowerRequired: 'O ID do mutuário é obrigatório',
  },
} as const

export default loansEditPt

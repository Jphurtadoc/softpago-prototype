/** Portuguese copy for the route edit page. */
const routesEditPt = {
  title: 'Editar rota',
  subtitle: 'Atualize as informações e os cobradores atribuídos.',
  loading: 'Carregando rota…',
  missingId: 'ID da rota ausente',
  notFound: 'Rota não encontrada',
  back: 'Voltar',
  backToList: 'Voltar às rotas',
  cancel: 'Cancelar',
  save: 'Salvar alterações',
  saving: 'Salvando…',
  sections: {
    info: 'Informações',
    infoDesc: 'Nome e descrição da rota.',
    collectors: 'Cobradores',
    collectorsDesc: 'Selecione pelo menos um cobrador.',
  },
  fields: {
    name: 'Nome da rota',
    description: 'Descrição',
    collectors: 'Cobradores',
  },
  collectors: {
    empty: 'Nenhum cobrador disponível.',
  },
  errors: {
    load: 'Não foi possível carregar a rota',
    update: 'Não foi possível atualizar a rota',
    nameRequired: 'O nome da rota é obrigatório',
    collectorsRequired: 'Selecione pelo menos um cobrador',
  },
} as const

export default routesEditPt

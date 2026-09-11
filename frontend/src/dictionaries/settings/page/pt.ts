/** Portuguese copy for the settings page. */
const settingsPagePt = {
  title: 'Configurações',
  description: 'Ajuste as preferências da plataforma e da sua conta.',
  navLabel: 'Seções de configurações',
  tabs: {
    general: 'Geral',
    account: 'Conta',
    security: 'Segurança',
    users: 'Usuários',
  },
  general: {
    title: 'Geral',
    description: 'Tema, idioma e menu principal.',
    appearance: {
      title: 'Aparência',
      description: 'Escolha o tema da interface.',
    },
    language: {
      title: 'Idioma',
      description: 'Idioma da interface.',
    },
    sidebar: {
      title: 'Comportamento da barra lateral',
      description: 'Escolha o comportamento do menu principal.',
    },
  },
  account: {
    title: 'Minhas informações',
    description: 'Dados básicos da sua conta.',
    name: 'Nome',
    email: 'E-mail',
    role: 'Função',
    edit: 'Editar',
    empty: 'Nenhuma sessão ativa.',
  },
  security: {
    title: 'Segurança',
    description: 'Proteja o acesso à sua conta.',
    changePassword: {
      title: 'Alterar senha',
      description: 'Atualize sua senha de acesso.',
    },
    currentPassword: 'Senha atual',
    newPassword: 'Nova senha',
    confirmPassword: 'Confirmar nova senha',
    submit: 'Salvar senha',
    showPassword: 'Mostrar senha',
    hidePassword: 'Ocultar senha',
    success: 'Senha atualizada.',
    errors: {
      currentRequired: 'Informe sua senha atual.',
      currentInvalid: 'A senha atual está incorreta.',
      newRequired: 'Informe uma nova senha.',
      newTooShort: 'A nova senha deve ter pelo menos 8 caracteres.',
      confirmMismatch: 'As senhas não coincidem.',
      sameAsCurrent: 'A nova senha deve ser diferente da atual.',
    },
  },
  users: {
    title: 'Usuários',
    description: 'Gerencie as contas com acesso à plataforma.',
    new: 'Novo',
    empty: 'Não há usuários para mostrar.',
    loadError: 'Não foi possível carregar os usuários.',
    searchPlaceholder: 'Buscar por nome ou e-mail',
    statusTabsLabel: 'Status',
    columns: {
      name: 'Nome',
      email: 'E-mail',
      role: 'Função',
      status: 'Status',
    },
    roles: {
      ADMIN: 'Admin',
      MANAGER: 'Gerente',
      COLLECTOR: 'Cobrador',
      VIEWER: 'Visualizador',
    },
    statuses: {
      ACTIVE: 'Ativo',
      INACTIVE: 'Inativo',
    },
    statusTabs: {
      all: 'Todos',
    },
    actions: {
      menu: 'Ações',
      menuFor: 'Ações de {{name}}',
      view: 'Ver',
      edit: 'Editar',
    },
    pagination: {
      prev: 'Anterior',
      next: 'Próximo',
      rows: 'Linhas',
      range: '{{start}}–{{end}} de {{total}}',
    },
  },
} as const

export default settingsPagePt

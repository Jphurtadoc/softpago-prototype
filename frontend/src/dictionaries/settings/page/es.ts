/** Spanish copy for the settings page. */
const settingsPageEs = {
  title: 'Configuraciones',
  description: 'Ajusta preferencias de la plataforma y de tu cuenta.',
  navLabel: 'Secciones de configuraciones',
  tabs: {
    general: 'General',
    account: 'Cuenta',
    security: 'Seguridad',
    users: 'Usuarios',
  },
  general: {
    title: 'General',
    description: 'Tema, idioma y menú principal.',
    appearance: {
      title: 'Apariencia',
      description: 'Elige el tema de la interfaz.',
    },
    language: {
      title: 'Idioma',
      description: 'Idioma de la interfaz.',
    },
    sidebar: {
      title: 'Comportamiento del sidebar',
      description: 'Elige el comportamiento del menú principal.',
    },
  },
  account: {
    title: 'Mi información',
    description: 'Datos básicos de tu cuenta.',
    name: 'Nombre',
    email: 'Correo',
    role: 'Rol',
    edit: 'Editar',
    empty: 'No hay sesión activa.',
  },
  security: {
    title: 'Seguridad',
    description: 'Protege el acceso a tu cuenta.',
    changePassword: {
      title: 'Cambiar contraseña',
      description: 'Actualiza tu contraseña de acceso.',
    },
    currentPassword: 'Contraseña actual',
    newPassword: 'Nueva contraseña',
    confirmPassword: 'Confirmar nueva contraseña',
    submit: 'Guardar contraseña',
    showPassword: 'Mostrar contraseña',
    hidePassword: 'Ocultar contraseña',
    success: 'Contraseña actualizada.',
    errors: {
      currentRequired: 'Ingresa tu contraseña actual.',
      currentInvalid: 'La contraseña actual no es correcta.',
      newRequired: 'Ingresa una nueva contraseña.',
      newTooShort: 'La nueva contraseña debe tener al menos 8 caracteres.',
      confirmMismatch: 'Las contraseñas no coinciden.',
      sameAsCurrent: 'La nueva contraseña debe ser distinta a la actual.',
    },
  },
  users: {
    title: 'Usuarios',
    description: 'Administra las cuentas con acceso a la plataforma.',
    new: 'Nuevo',
    empty: 'No hay usuarios para mostrar.',
    loadError: 'No se pudieron cargar los usuarios.',
    searchPlaceholder: 'Buscar por nombre o correo',
    statusTabsLabel: 'Estado',
    columns: {
      name: 'Nombre',
      email: 'Correo',
      role: 'Rol',
      status: 'Estado',
    },
    roles: {
      ADMIN: 'Admin',
      MANAGER: 'Gerente',
      COLLECTOR: 'Cobrador',
      VIEWER: 'Visor',
    },
    statuses: {
      ACTIVE: 'Activo',
      INACTIVE: 'Inactivo',
    },
    statusTabs: {
      all: 'Todos',
    },
    actions: {
      menu: 'Acciones',
      menuFor: 'Acciones de {{name}}',
      view: 'Ver',
      edit: 'Editar',
    },
    pagination: {
      prev: 'Anterior',
      next: 'Siguiente',
      rows: 'Filas',
      range: '{{start}}–{{end}} de {{total}}',
    },
  },
} as const

export default settingsPageEs

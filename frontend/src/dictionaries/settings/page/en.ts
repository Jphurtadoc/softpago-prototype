/** English copy for the settings page. */
const settingsPageEn = {
  title: 'Settings',
  description: 'Adjust platform and account preferences.',
  navLabel: 'Settings sections',
  tabs: {
    general: 'General',
    account: 'Account',
    security: 'Security',
    users: 'Users',
  },
  general: {
    title: 'General',
    description: 'Theme, language, and main menu.',
    appearance: {
      title: 'Appearance',
      description: 'Choose the interface theme.',
    },
    language: {
      title: 'Language',
      description: 'Interface language.',
    },
    sidebar: {
      title: 'Sidebar behavior',
      description: 'Choose how the main menu behaves.',
    },
  },
  account: {
    title: 'My information',
    description: 'Basic details for your account.',
    name: 'Name',
    email: 'Email',
    role: 'Role',
    edit: 'Edit',
    empty: 'No active session.',
  },
  security: {
    title: 'Security',
    description: 'Protect access to your account.',
    changePassword: {
      title: 'Change password',
      description: 'Update your sign-in password.',
    },
    currentPassword: 'Current password',
    newPassword: 'New password',
    confirmPassword: 'Confirm new password',
    submit: 'Save password',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    success: 'Password updated.',
    errors: {
      currentRequired: 'Enter your current password.',
      currentInvalid: 'Current password is incorrect.',
      newRequired: 'Enter a new password.',
      newTooShort: 'New password must be at least 8 characters.',
      confirmMismatch: 'Passwords do not match.',
      sameAsCurrent: 'New password must differ from the current one.',
    },
  },
  users: {
    title: 'Users',
    description: 'Manage accounts with access to the platform.',
    new: 'New',
    empty: 'No users to show.',
    loadError: 'Could not load users.',
    searchPlaceholder: 'Search by name or email',
    statusTabsLabel: 'Status',
    columns: {
      name: 'Name',
      email: 'Email',
      role: 'Role',
      status: 'Status',
    },
    roles: {
      ADMIN: 'Admin',
      MANAGER: 'Manager',
      COLLECTOR: 'Collector',
      VIEWER: 'Viewer',
    },
    statuses: {
      ACTIVE: 'Active',
      INACTIVE: 'Inactive',
    },
    statusTabs: {
      all: 'All',
    },
    actions: {
      menu: 'Actions',
      menuFor: 'Actions for {{name}}',
      view: 'View',
      edit: 'Edit',
    },
    pagination: {
      prev: 'Previous',
      next: 'Next',
      rows: 'Rows',
      range: '{{start}}–{{end}} of {{total}}',
    },
  },
} as const

export default settingsPageEn

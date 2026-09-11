import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
} from '@mui/material'
import {
  DarkModeOutlined,
  ExpandMore,
  GroupOutlined,
  LanguageOutlined,
  LockOutlined,
  PersonOutlined,
  SettingsOutlined,
  ViewSidebarOutlined,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import LocaleToggle from '@/features/auth/components/LocaleToggle/LocaleToggle'
import ThemeModeToggle from '@/features/auth/components/ThemeModeToggle/ThemeModeToggle'
import { createAuthTheme } from '@/features/auth/themes/authTheme'
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
} from '@/features/auth/services/auth.service'
import { SettingsUsersPanel } from '@/features/users/components/SettingsUsersPanel'
import { PROTOTYPE_CREDENTIALS } from '@/mocks/prototype-store'
import { PageHeader } from '@/shared/components/layouts/PageHeader'
import SidebarBehaviorToggle from '@/shared/components/SidebarBehaviorToggle/SidebarBehaviorToggle'
import { useColorMode } from '@/shared/themes/color-mode-context'
import './SettingsPage.css'

const SETTINGS_TABS = ['general', 'cuenta', 'seguridad', 'usuarios'] as const

type SettingsTab = (typeof SETTINGS_TABS)[number]

const MIN_PASSWORD_LENGTH = 8
const NAV_ITEM_SIZE = 46
const NAV_ITEM_GAP = 8

interface SettingsNavItem {
  readonly id: SettingsTab
  readonly labelKey:
    | 'tabs.general'
    | 'tabs.account'
    | 'tabs.security'
    | 'tabs.users'
  readonly icon: ReactNode
}

const NAV_ITEMS: ReadonlyArray<SettingsNavItem> = [
  {
    id: 'general',
    labelKey: 'tabs.general',
    icon: <SettingsOutlined fontSize="inherit" />,
  },
  {
    id: 'cuenta',
    labelKey: 'tabs.account',
    icon: <PersonOutlined fontSize="inherit" />,
  },
  {
    id: 'seguridad',
    labelKey: 'tabs.security',
    icon: <LockOutlined fontSize="inherit" />,
  },
  {
    id: 'usuarios',
    labelKey: 'tabs.users',
    icon: <GroupOutlined fontSize="inherit" />,
  },
]

/**
 * Resolves the active settings tab from the URL query string.
 */
function resolveSettingsTab(value: string | null): SettingsTab {
  if (
    value === 'cuenta' ||
    value === 'seguridad' ||
    value === 'usuarios'
  ) {
    return value
  }
  return 'general'
}

interface SettingRowProps {
  readonly title: string
  readonly description: string
  readonly control: ReactNode
  readonly icon: ReactNode
  readonly className?: string
}

/**
 * Label + control row for preference items.
 */
const SettingRow = ({
  title,
  description,
  control,
  icon,
  className,
}: SettingRowProps) => {
  return (
    <div className={['settings-row', className].filter(Boolean).join(' ')}>
      <div className="settings-row__lead">
        <span className="settings-icon" aria-hidden>
          {icon}
        </span>
        <div className="settings-row__copy">
          <Typography variant="subtitle1" component="h3" className="settings-row__title">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </div>
      </div>
      <div className="settings-row__control">{control}</div>
    </div>
  )
}

interface PasswordFieldProps {
  readonly label: string
  readonly value: string
  readonly onChange: (value: string) => void
  readonly autoComplete: string
  readonly showPassword: boolean
  readonly onToggleVisibility: () => void
  readonly showLabel: string
  readonly hideLabel: string
  readonly disabled: boolean
}

/**
 * Password field with show/hide control, styled by the auth theme.
 */
const PasswordField = ({
  label,
  value,
  onChange,
  autoComplete,
  showPassword,
  onToggleVisibility,
  showLabel,
  hideLabel,
  disabled,
}: PasswordFieldProps) => {
  return (
    <TextField
      className="settings-field"
      label={label}
      type={showPassword ? 'text' : 'password'}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      fullWidth
      autoComplete={autoComplete}
      disabled={disabled}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={showPassword ? hideLabel : showLabel}
                onClick={onToggleVisibility}
                edge="end"
                disabled={disabled}
                size="small"
                className="settings-field__visibility"
              >
                {showPassword ? (
                  <VisibilityOff fontSize="inherit" />
                ) : (
                  <Visibility fontSize="inherit" />
                )}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  )
}

/**
 * Settings page with sidebar-style interior nav and auth-matched controls.
 */
export function SettingsPage() {
  const { t } = useTranslation('settings/page')
  const { resolvedMode } = useColorMode()
  const authTheme = useMemo(() => createAuthTheme(resolvedMode), [resolvedMode])
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = useMemo(
    () => resolveSettingsTab(searchParams.get('tab')),
    [searchParams],
  )
  const activeIndex = NAV_ITEMS.findIndex((item) => item.id === activeTab)

  const user = getAuthenticatedUser()
  const displayName = getAuthenticatedUserName()
  const avatarInitial = (displayName ?? 'U').charAt(0).toUpperCase()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [isPasswordAccordionOpen, setIsPasswordAccordionOpen] = useState(false)

  const handleTabSelect = (nextValue: SettingsTab) => {
    if (nextValue === 'general') {
      setSearchParams({})
      return
    }
    setSearchParams({ tab: nextValue })
  }

  const handlePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPasswordSuccess(false)

    if (!currentPassword) {
      setPasswordError(t('security.errors.currentRequired'))
      return
    }
    if (currentPassword !== PROTOTYPE_CREDENTIALS.password) {
      setPasswordError(t('security.errors.currentInvalid'))
      return
    }
    if (!newPassword) {
      setPasswordError(t('security.errors.newRequired'))
      return
    }
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(t('security.errors.newTooShort'))
      return
    }
    if (newPassword === currentPassword) {
      setPasswordError(t('security.errors.sameAsCurrent'))
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(t('security.errors.confirmMismatch'))
      return
    }

    setIsSavingPassword(true)
    setPasswordError('')
    window.setTimeout(() => {
      setIsSavingPassword(false)
      setPasswordSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }, 400)
  }

  return (
    <ThemeProvider theme={authTheme}>
      <div className="settings-page" data-theme={resolvedMode}>
        <PageHeader title={t('title')} description={t('description')} />

        <div className="settings-shell">
          <nav
            className="settings-nav"
            role="tablist"
            aria-label={t('navLabel')}
            aria-orientation="vertical"
          >
            <span
              className="settings-nav__indicator"
              style={{
                transform: `translateY(${Math.max(activeIndex, 0) * (NAV_ITEM_SIZE + NAV_ITEM_GAP)}px)`,
              }}
              aria-hidden="true"
            />
            {NAV_ITEMS.map((item) => {
              const isActive = item.id === activeTab
              const label = t(item.labelKey)
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`settings-panel-${item.id}`}
                  id={`settings-tab-${item.id}`}
                  className={`settings-nav__item${isActive ? ' settings-nav__item--active' : ''}`}
                  onClick={() => handleTabSelect(item.id)}
                >
                  <span className="settings-nav__item-content">
                    <span className="settings-nav__item-icon" aria-hidden>
                      {item.icon}
                    </span>
                    <span className="settings-nav__item-label">{label}</span>
                  </span>
                </button>
              )
            })}
          </nav>

          <div className="settings-main">
            {activeTab === 'general' && (
              <section
                id="settings-panel-general"
                className="settings-section"
                role="tabpanel"
                aria-labelledby="settings-tab-general"
              >
                <header className="settings-section__header">
                  <Typography variant="h6" component="h2" className="settings-section__title">
                    {t('general.title')}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="settings-section__description"
                  >
                    {t('general.description')}
                  </Typography>
                </header>

                <div className="settings-card">
                  <SettingRow
                    icon={<DarkModeOutlined fontSize="inherit" />}
                    title={t('general.appearance.title')}
                    description={t('general.appearance.description')}
                    control={<ThemeModeToggle />}
                  />
                </div>
                <div className="settings-card">
                  <SettingRow
                    icon={<ViewSidebarOutlined fontSize="inherit" />}
                    title={t('general.sidebar.title')}
                    description={t('general.sidebar.description')}
                    control={<SidebarBehaviorToggle />}
                  />
                </div>
                <div className="settings-card">
                  <SettingRow
                    icon={<LanguageOutlined fontSize="inherit" />}
                    title={t('general.language.title')}
                    description={t('general.language.description')}
                    control={<LocaleToggle menuPlacement="bottom" />}
                  />
                </div>
              </section>
            )}

            {activeTab === 'cuenta' && (
              <section
                id="settings-panel-cuenta"
                className="settings-section"
                role="tabpanel"
                aria-labelledby="settings-tab-cuenta"
              >
                <header className="settings-section__header">
                  <Typography variant="h6" component="h2" className="settings-section__title">
                    {t('account.title')}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="settings-section__description"
                  >
                    {t('account.description')}
                  </Typography>
                </header>

                {!user ? (
                  <Alert severity="info">{t('account.empty')}</Alert>
                ) : (
                  <div className="settings-card settings-account">
                    <div className="settings-account__profile">
                      <div className="settings-account__avatar" aria-hidden>
                        <span className="settings-account__avatar-fallback">
                          {avatarInitial}
                        </span>
                      </div>
                      <div className="settings-account__meta">
                        <p className="settings-account__name">
                          {displayName ?? '—'}
                        </p>
                        <p className="settings-account__email">{user.email}</p>
                        <p className="settings-account__role">{user.role}</p>
                      </div>
                      <Button
                        type="button"
                        variant="outlined"
                        disabled
                        className="settings-account__edit"
                        aria-disabled="true"
                      >
                        {t('account.edit')}
                      </Button>
                    </div>
                  </div>
                )}
              </section>
            )}

            {activeTab === 'seguridad' && (
              <section
                id="settings-panel-seguridad"
                className="settings-section"
                role="tabpanel"
                aria-labelledby="settings-tab-seguridad"
              >
                <header className="settings-section__header">
                  <Typography variant="h6" component="h2" className="settings-section__title">
                    {t('security.title')}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="settings-section__description"
                  >
                    {t('security.description')}
                  </Typography>
                </header>

                <div className="settings-card settings-card--accordion">
                  <Accordion
                    className="settings-accordion"
                    disableGutters
                    elevation={0}
                    expanded={isPasswordAccordionOpen}
                    onChange={(_event, isExpanded) =>
                      setIsPasswordAccordionOpen(isExpanded)
                    }
                  >
                    <AccordionSummary
                      aria-controls="settings-change-password-content"
                      id="settings-change-password-header"
                      className="settings-accordion__summary"
                    >
                      <SettingRow
                        className="settings-row--accordion"
                        icon={<LockOutlined fontSize="inherit" />}
                        title={t('security.changePassword.title')}
                        description={t('security.changePassword.description')}
                        control={
                          <span
                            className={`settings-accordion__chevron${
                              isPasswordAccordionOpen
                                ? ' settings-accordion__chevron--open'
                                : ''
                            }`}
                            aria-hidden
                          >
                            <ExpandMore fontSize="inherit" />
                          </span>
                        }
                      />
                    </AccordionSummary>
                    <AccordionDetails className="settings-accordion__details">
                      <Box
                        component="form"
                        onSubmit={handlePasswordSubmit}
                        noValidate
                      >
                        <Stack spacing={2.5}>
                          {passwordError ? (
                            <Alert severity="error">{passwordError}</Alert>
                          ) : null}
                          {passwordSuccess ? (
                            <Alert severity="success">{t('security.success')}</Alert>
                          ) : null}

                          <PasswordField
                            label={t('security.currentPassword')}
                            value={currentPassword}
                            onChange={setCurrentPassword}
                            autoComplete="current-password"
                            showPassword={showCurrentPassword}
                            onToggleVisibility={() =>
                              setShowCurrentPassword((prev) => !prev)
                            }
                            showLabel={t('security.showPassword')}
                            hideLabel={t('security.hidePassword')}
                            disabled={isSavingPassword}
                          />
                          <PasswordField
                            label={t('security.newPassword')}
                            value={newPassword}
                            onChange={setNewPassword}
                            autoComplete="new-password"
                            showPassword={showNewPassword}
                            onToggleVisibility={() =>
                              setShowNewPassword((prev) => !prev)
                            }
                            showLabel={t('security.showPassword')}
                            hideLabel={t('security.hidePassword')}
                            disabled={isSavingPassword}
                          />
                          <PasswordField
                            label={t('security.confirmPassword')}
                            value={confirmPassword}
                            onChange={setConfirmPassword}
                            autoComplete="new-password"
                            showPassword={showConfirmPassword}
                            onToggleVisibility={() =>
                              setShowConfirmPassword((prev) => !prev)
                            }
                            showLabel={t('security.showPassword')}
                            hideLabel={t('security.hidePassword')}
                            disabled={isSavingPassword}
                          />

                          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                              type="submit"
                              variant="contained"
                              color="primary"
                              disabled={isSavingPassword}
                            >
                              {t('security.submit')}
                            </Button>
                          </Box>
                        </Stack>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </div>
              </section>
            )}

            {activeTab === 'usuarios' ? <SettingsUsersPanel /> : null}
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

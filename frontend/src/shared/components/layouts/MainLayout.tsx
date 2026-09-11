import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import MobileAppBar from '../MobileAppBar/MobileAppBar'
import Navbar, { type ActiveUserMenuItem } from '../Navbar/Navbar'
import { DEFAULT_ITEMS, type NavItem } from '../Navbar/defaultNavItems'
import { ConfirmDialog } from '../ConfirmDialog/ConfirmDialog'
import {
  clearAccessToken,
  getAuthenticatedUserEmail,
  getAuthenticatedUserName,
  getAuthenticatedUserRole,
} from '@/features/auth/services/auth.service'
import { useColorMode } from '@/shared/themes/color-mode-context'
import './MainLayout.css'

/**
 * Resolves the sidebar active item from the current path.
 * Returns `null` when the route is outside main nav (e.g. settings via avatar menu).
 */
function getActiveNavItemId(pathname: string, items: NavItem[]): string | null {
  let bestMatch: NavItem | undefined
  for (const item of items) {
    const isMatch =
      pathname === item.url || pathname.startsWith(`${item.url}/`)
    if (!isMatch) continue
    if (!bestMatch || item.url.length > bestMatch.url.length) {
      bestMatch = item
    }
  }
  return bestMatch?.id ?? null
}

/**
 * Resolves which avatar-menu entry is active on the settings route.
 */
function getActiveUserMenuItem(
  pathname: string,
  search: string,
): ActiveUserMenuItem | null {
  if (pathname !== '/configuraciones') return null
  const tab = new URLSearchParams(search).get('tab')
  if (tab === 'cuenta') return 'account'
  return 'settings'
}

export function MainLayout() {
  const { t } = useTranslation('common/nav')
  const location = useLocation()
  const navigate = useNavigate()
  const { preference, resolvedMode, setPreference } = useColorMode()
  const [expanded, setExpanded] = useState(false)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const active = getActiveNavItemId(location.pathname, DEFAULT_ITEMS)
  const activeUserMenuItem = getActiveUserMenuItem(
    location.pathname,
    location.search,
  )
  const userName = getAuthenticatedUserName()
  const userRole = getAuthenticatedUserRole()
  const userEmail = getAuthenticatedUserEmail()
  const userFallback = t('userFallback')

  const handleItemClick = (item: NavItem) => {
    navigate(item.url)
  }

  const handleSettingsClick = () => {
    navigate('/configuraciones')
  }

  const handleAccountClick = () => {
    navigate('/configuraciones?tab=cuenta')
  }

  const handleLogoutConfirm = () => {
    clearAccessToken()
    setLogoutDialogOpen(false)
    navigate('/')
  }

  return (
    <div className="app" data-theme={resolvedMode} data-theme-preference={preference}>
      <MobileAppBar
        activeItem={active}
        onItemClick={handleItemClick}
        theme={resolvedMode}
        themePreference={preference}
        onThemeChange={setPreference}
        userName={userName ?? userFallback}
        userRole={userRole ?? undefined}
        userEmail={userEmail ?? undefined}
        userAvatarUrl={undefined}
        onAccountClick={handleAccountClick}
        onSettingsClick={handleSettingsClick}
        onLogoutClick={() => setLogoutDialogOpen(true)}
        activeUserMenuItem={activeUserMenuItem}
      />
      <Navbar
        activeItem={active}
        onItemClick={handleItemClick}
        isExpanded={expanded}
        onExpandedChange={setExpanded}
        theme={resolvedMode}
        themePreference={preference}
        onThemeChange={setPreference}
        onLogoutClick={() => setLogoutDialogOpen(true)}
        onSettingsClick={handleSettingsClick}
        onAccountClick={handleAccountClick}
        activeUserMenuItem={activeUserMenuItem}
        userName={userName ?? userFallback}
        userRole={userRole ?? undefined}
        userEmail={userEmail ?? undefined}
        userAvatarUrl={undefined}
      />
      <main
        className={`app__content${expanded ? ' app__content--expanded' : ''}`}
      >
        <Outlet />
      </main>
      <ConfirmDialog
        open={logoutDialogOpen}
        theme={resolvedMode}
        title={t('logoutDialog.title')}
        description={t('logoutDialog.description')}
        confirmLabel={t('logoutDialog.confirm')}
        cancelLabel={t('logoutDialog.cancel')}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setLogoutDialogOpen(false)}
      />
    </div>
  )
}

import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import MobileAppBar from '../MobileAppBar/MobileAppBar'
import Navbar from '../Navbar/Navbar'
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

export function MainLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { preference, resolvedMode, setPreference } = useColorMode()
  const [expanded, setExpanded] = useState(false)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const active =
    DEFAULT_ITEMS.find((item) => item.url === location.pathname)?.id ??
    DEFAULT_ITEMS[0].id
  const userName = getAuthenticatedUserName()
  const userRole = getAuthenticatedUserRole()
  const userEmail = getAuthenticatedUserEmail()

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
        userName={userName ?? 'Usuario'}
        userRole={userRole ?? undefined}
        userEmail={userEmail ?? undefined}
        userAvatarUrl={undefined}
        onAccountClick={handleAccountClick}
        onSettingsClick={handleSettingsClick}
        onLogoutClick={() => setLogoutDialogOpen(true)}
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
        userName={userName ?? 'Usuario'}
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
        title="Cerrar sesión"
        description="¿Estás seguro que deseas cerrar sesión?"
        confirmLabel="Sí, cerrar sesión"
        cancelLabel="No"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setLogoutDialogOpen(false)}
      />
    </div>
  )
}

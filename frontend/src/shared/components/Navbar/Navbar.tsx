import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  THEME_MODE_ICONS,
  THEME_MODE_ICON_SIZE,
  THEME_MODE_ICON_STROKE,
} from '@/shared/icons/theme-mode-icons'
import { DEFAULT_ITEMS, type NavItem } from './defaultNavItems'
import './Navbar.css'

export type { NavItem }

export type ThemePreference = 'light' | 'dark' | 'system'

export interface NavbarProps {
  activeItem?: string
  onItemClick?: (item: NavItem) => void
  items?: NavItem[]
  logo?: ReactNode
  userName?: string
  userRole?: string
  userEmail?: string
  userAvatarUrl?: string
  isExpanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  defaultExpanded?: boolean
  theme?: 'light' | 'dark'
  themePreference?: ThemePreference
  onThemeChange?: (theme: ThemePreference) => void
  defaultTheme?: 'light' | 'dark'
  onLogoutClick?: () => void
  onSettingsClick?: () => void
  onAccountClick?: () => void
}

const IconPin = ({ filled }: { filled: boolean }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14.5 2.5 21.5 9.5 18 13 16.8 18.9 14 21.7 10 17.7 4.8 22.9 2.9 21 8.1 15.8 4.1 11.8 6.9 9 12.8 7.8Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      fill={filled ? 'currentColor' : 'none'}
    />
  </svg>
)

const IconAccount = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.75" />
    <path
      d="M5.5 19.2c1.6-2.6 3.9-3.9 6.5-3.9s4.9 1.3 6.5 3.9"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </svg>
)

const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 17l5-5-5-5M21 12H9"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const IconSettings = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
      stroke="currentColor"
      strokeWidth="1.75"
    />
    <path
      d="M19.4 13.1a1.6 1.6 0 0 0 .32 1.76l.06.06a1.95 1.95 0 1 1-2.76 2.76l-.06-.06a1.6 1.6 0 0 0-1.76-.32 1.6 1.6 0 0 0-.97 1.46V19a1.95 1.95 0 1 1-3.9 0v-.08a1.6 1.6 0 0 0-1.05-1.46 1.6 1.6 0 0 0-1.76.32l-.06.06a1.95 1.95 0 1 1-2.76-2.76l.06-.06a1.6 1.6 0 0 0 .32-1.76 1.6 1.6 0 0 0-1.46-.97H5a1.95 1.95 0 1 1 0-3.9h.08a1.6 1.6 0 0 0 1.46-1.05 1.6 1.6 0 0 0-.32-1.76l-.06-.06a1.95 1.95 0 1 1 2.76-2.76l.06.06a1.6 1.6 0 0 0 1.76.32h.08A1.6 1.6 0 0 0 11.9 5V5a1.95 1.95 0 1 1 3.9 0v.08a1.6 1.6 0 0 0 .97 1.46 1.6 1.6 0 0 0 1.76-.32l.06-.06a1.95 1.95 0 1 1 2.76 2.76l-.06.06a1.6 1.6 0 0 0-.32 1.76v.08a1.6 1.6 0 0 0 1.46.97H19a1.95 1.95 0 1 1 0 3.9h-.08a1.6 1.6 0 0 0-1.46.97Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinejoin="round"
    />
  </svg>
)

const IconMore = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="5" r="1.6" fill="currentColor" />
    <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    <circle cx="12" cy="19" r="1.6" fill="currentColor" />
  </svg>
)

const THEME_OPTIONS: ReadonlyArray<ThemePreference> = ['light', 'dark', 'system']

const ITEM_SIZE = 46
const ITEM_GAP = 16

const BRAND_SRC = {
  light: '/logo.svg',
  dark: '/logo_secondary.svg',
} as const

function Navbar({
  activeItem,
  onItemClick,
  items = DEFAULT_ITEMS,
  logo,
  userName,
  userRole,
  userEmail,
  userAvatarUrl,
  isExpanded,
  onExpandedChange,
  defaultExpanded = false,
  theme,
  themePreference,
  onThemeChange,
  defaultTheme = 'light',
  onLogoutClick,
  onSettingsClick,
  onAccountClick,
}: NavbarProps) {
  const { t } = useTranslation('common/theme')
  const menuId = useId()
  const menuRef = useRef<HTMLDivElement | null>(null)
  const moreButtonRef = useRef<HTMLButtonElement | null>(null)
  const avatarButtonRef = useRef<HTMLButtonElement | null>(null)
  const [internalActive, setInternalActive] = useState<string>(
    activeItem ?? items[0]?.id,
  )
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded)
  const [internalPreference, setInternalPreference] = useState<ThemePreference>(
    themePreference ?? 'system',
  )
  const [internalTheme, setInternalTheme] = useState<'light' | 'dark'>(defaultTheme)
  const [pinned, setPinned] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const active = activeItem ?? internalActive
  const expanded = isExpanded ?? internalExpanded
  const currentPreference = themePreference ?? internalPreference
  const currentTheme = theme ?? internalTheme
  const activeIndex = items.findIndex((item) => item.id === active)
  const brandSrc = BRAND_SRC[currentTheme]
  const displayName = userName?.trim().split(/\s+/)[0] || 'Usuario'
  const displayRole = userRole
    ? `${userRole.charAt(0).toUpperCase()}${userRole.slice(1).toLowerCase()}`
    : undefined
  const avatarInitial = displayName.charAt(0).toUpperCase()
  const selectedThemeIndex = Math.max(
    0,
    THEME_OPTIONS.findIndex((option) => option === currentPreference),
  )

  const setExpanded = (next: boolean) => {
    if (isExpanded === undefined) {
      setInternalExpanded(next)
    }
    onExpandedChange?.(next)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (isUserMenuOpen) return
    setExpanded(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (!pinned && !isUserMenuOpen) {
      setExpanded(false)
    }
  }

  const togglePin = () => {
    if (isUserMenuOpen) return
    const next = !pinned
    setPinned(next)
    setExpanded(next || isHovered)
  }

  const handleThemeSelect = (next: ThemePreference) => {
    if (themePreference === undefined) {
      setInternalPreference(next)
      if (next !== 'system') {
        setInternalTheme(next)
      }
    }
    onThemeChange?.(next)
  }

  const handleClick = (item: NavItem) => {
    if (activeItem === undefined) {
      setInternalActive(item.id)
    }
    onItemClick?.(item)
  }

  const handleCloseUserMenu = () => {
    setIsUserMenuOpen(false)
  }

  const handleOpenUserMenu = () => {
    setIsUserMenuOpen(true)
    setPinned(false)
    setExpanded(false)
  }

  const handleToggleUserMenu = () => {
    if (isUserMenuOpen) {
      handleCloseUserMenu()
      return
    }
    handleOpenUserMenu()
  }

  useEffect(() => {
    if (!isUserMenuOpen) return
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (menuRef.current?.contains(target)) return
      if (moreButtonRef.current?.contains(target)) return
      if (avatarButtonRef.current?.contains(target)) return
      setIsUserMenuOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isUserMenuOpen])

  return (
    <aside
      className={`sidebar${expanded ? ' sidebar--expanded' : ''}`}
      data-theme={currentTheme}
      aria-label="Navegación principal"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="sidebar__header">
        <div className="sidebar__brand">
          {logo ?? (
            <img
              src={brandSrc}
              alt="SoftPago"
              className={`sidebar__logo${expanded ? ' sidebar__logo--expanded' : ' sidebar__logo--collapsed'}`}
            />
          )}
        </div>

        <button
          type="button"
          className={`sidebar__pin${pinned ? ' sidebar__pin--active' : ''}`}
          onClick={togglePin}
          aria-label={pinned ? 'Desanclar menú' : 'Anclar menú abierto'}
          aria-pressed={pinned}
        >
          <IconPin filled={pinned} />
        </button>
      </div>

      <nav className="sidebar__nav" role="tablist" aria-orientation="vertical">
        <span
          className="sidebar__indicator"
          style={{
            transform: `translateY(${activeIndex * (ITEM_SIZE + ITEM_GAP)}px)`,
          }}
          aria-hidden="true"
        />

        {items.map((item) => {
          const isActive = item.id === active
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={item.title}
              className={`sidebar__item${isActive ? ' sidebar__item--active' : ''}`}
              onClick={() => handleClick(item)}
            >
              <span className="sidebar__item-content">
                <span className="sidebar__item-icon">{item.icon}</span>
                <span className="sidebar__item-label">{item.title}</span>
              </span>
              {!expanded && <span className="sidebar__tooltip">{item.title}</span>}
            </button>
          )
        })}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__user-card">
          <button
            ref={avatarButtonRef}
            type="button"
            className="sidebar__avatar-button"
            aria-label={expanded ? displayName : 'Menú de usuario'}
            aria-haspopup={expanded ? undefined : 'menu'}
            aria-expanded={expanded ? undefined : isUserMenuOpen}
            onClick={() => {
              if (!expanded) {
                handleToggleUserMenu()
              }
            }}
          >
            <div className="sidebar__avatar">
              {userAvatarUrl ? (
                <img src={userAvatarUrl} alt="" />
              ) : (
                <span className="sidebar__avatar-fallback">{avatarInitial}</span>
              )}
            </div>
          </button>
          <div className="sidebar__user-meta">
            <span className="sidebar__user-name">{displayName}</span>
            {displayRole && (
              <span className="sidebar__user-role">{displayRole}</span>
            )}
          </div>
          <button
            ref={moreButtonRef}
            type="button"
            className="sidebar__user-more"
            aria-label="Menú de usuario"
            aria-haspopup="menu"
            aria-expanded={isUserMenuOpen}
            aria-controls={isUserMenuOpen ? menuId : undefined}
            onClick={handleToggleUserMenu}
          >
            <IconMore />
          </button>

          {isUserMenuOpen && (
            <div
              ref={menuRef}
              id={menuId}
              className="sidebar__user-menu"
              role="menu"
              aria-label="Menú de usuario"
            >
              <div className="sidebar__user-menu-profile">
                <div className="sidebar__avatar sidebar__avatar--menu">
                  {userAvatarUrl ? (
                    <img src={userAvatarUrl} alt="" />
                  ) : (
                    <span className="sidebar__avatar-fallback">{avatarInitial}</span>
                  )}
                </div>
                <div className="sidebar__user-menu-profile-meta">
                  <span className="sidebar__user-name">{displayName}</span>
                  {userEmail && (
                    <span className="sidebar__user-email">{userEmail}</span>
                  )}
                </div>
              </div>

              <button
                type="button"
                className="sidebar__user-menu-item"
                role="menuitem"
                onClick={() => {
                  handleCloseUserMenu()
                  onAccountClick?.()
                }}
              >
                <span className="sidebar__user-menu-icon">
                  <IconAccount />
                </span>
                <span>Cuenta</span>
              </button>

              <button
                type="button"
                className="sidebar__user-menu-item"
                role="menuitem"
                onClick={() => {
                  handleCloseUserMenu()
                  onSettingsClick?.()
                }}
              >
                <span className="sidebar__user-menu-icon">
                  <IconSettings />
                </span>
                <span>Configuraciones</span>
              </button>

              <div className="sidebar__user-menu-theme" role="none">
                <span className="sidebar__user-menu-theme-label">
                  {t('groupLabel')}
                </span>
                <div
                  className="sidebar__theme-segment"
                  role="group"
                  aria-label={t('groupLabel')}
                >
                  <span
                    className="sidebar__theme-segment-thumb"
                    style={{
                      transform: `translateX(${selectedThemeIndex * 100}%)`,
                    }}
                    aria-hidden="true"
                  />
                  {THEME_OPTIONS.map((value) => {
                    const isSelected = currentPreference === value
                    const Icon = THEME_MODE_ICONS[value]
                    return (
                      <button
                        key={value}
                        type="button"
                        className={`sidebar__theme-segment-btn${
                          isSelected ? ' sidebar__theme-segment-btn--active' : ''
                        }`}
                        aria-label={t(value)}
                        aria-pressed={isSelected}
                        onClick={() => handleThemeSelect(value)}
                      >
                        <Icon
                          size={THEME_MODE_ICON_SIZE}
                          strokeWidth={THEME_MODE_ICON_STROKE}
                          aria-hidden
                        />
                      </button>
                    )
                  })}
                </div>
              </div>

              {onLogoutClick && (
                <button
                  type="button"
                  className="sidebar__user-menu-item sidebar__user-menu-item--danger"
                  role="menuitem"
                  onClick={() => {
                    handleCloseUserMenu()
                    onLogoutClick()
                  }}
                >
                  <span className="sidebar__user-menu-icon">
                    <IconLogout />
                  </span>
                  <span>Cerrar sesión</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

export default Navbar

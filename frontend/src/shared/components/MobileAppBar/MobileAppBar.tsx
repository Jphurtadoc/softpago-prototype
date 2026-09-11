import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MorphIcon } from 'morphicons/react'
import { X, EllipsisVertical, type IconNode } from 'lucide'
import {
  THEME_MODE_ICONS,
  THEME_MODE_ICON_SIZE,
  THEME_MODE_ICON_STROKE,
} from '@/shared/icons/theme-mode-icons'
import { DEFAULT_ITEMS, type NavItem } from '../Navbar/defaultNavItems'
import type { ThemePreference } from '../Navbar/Navbar'
import './MobileAppBar.css'

/** Two-bar burger icon in Lucide IconNode format for morphicons. */
const Menu2Bars: IconNode = [
  ['line', { x1: '4', x2: '20', y1: '9', y2: '9' }],
  ['line', { x1: '4', x2: '20', y1: '15', y2: '15' }],
]

const BRAND_SECONDARY = '/logo_secondary.svg'
const THEME_OPTIONS: ReadonlyArray<ThemePreference> = ['light', 'dark', 'system']
const ITEM_FADE_STAGGER_MS = 40

type PanelMode = 'nav' | 'account'

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

export interface MobileAppBarProps {
  activeItem?: string
  onItemClick?: (item: NavItem) => void
  items?: NavItem[]
  theme?: 'light' | 'dark'
  themePreference?: ThemePreference
  onThemeChange?: (theme: ThemePreference) => void
  userName?: string
  userRole?: string
  userEmail?: string
  userAvatarUrl?: string
  onAccountClick?: () => void
  onSettingsClick?: () => void
  onLogoutClick?: () => void
}

/**
 * Responsive top bar with secondary brand mark.
 * Avatar 3-dot control swaps the panel list between nav and account options.
 */
function MobileAppBar({
  activeItem,
  onItemClick,
  items = DEFAULT_ITEMS,
  theme = 'dark',
  themePreference = 'system',
  onThemeChange,
  userName,
  userRole,
  userEmail,
  userAvatarUrl,
  onAccountClick,
  onSettingsClick,
  onLogoutClick,
}: MobileAppBarProps) {
  const { t } = useTranslation('common/theme')
  const panelId = useId()
  const fadeTimeoutRef = useRef<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [panelMode, setPanelMode] = useState<PanelMode>('nav')
  const [moreIconMode, setMoreIconMode] = useState<PanelMode>('nav')
  const [navFade, setNavFade] = useState<'in' | 'out'>('in')
  const active = activeItem ?? items[0]?.id
  const displayName = userName?.trim().split(/\s+/)[0] || 'Usuario'
  const displayRole = userRole
    ? `${userRole.charAt(0).toUpperCase()}${userRole.slice(1).toLowerCase()}`
    : ''
  const avatarInitial = displayName.charAt(0).toUpperCase()
  const selectedThemeIndex = Math.max(
    0,
    THEME_OPTIONS.findIndex((option) => option === themePreference),
  )

  const clearFadeTimeout = () => {
    if (fadeTimeoutRef.current !== null) {
      window.clearTimeout(fadeTimeoutRef.current)
      fadeTimeoutRef.current = null
    }
  }

  const getItemFadeStyle = (index: number): CSSProperties | undefined => {
    if (navFade !== 'in') return undefined
    return { animationDelay: `${index * ITEM_FADE_STAGGER_MS}ms` }
  }

  const handleClose = () => {
    clearFadeTimeout()
    setIsOpen(false)
    setPanelMode('nav')
    setMoreIconMode('nav')
    setNavFade('in')
  }

  const handleToggle = () => {
    setIsOpen((prev) => {
      if (prev) {
        clearFadeTimeout()
        setPanelMode('nav')
        setMoreIconMode('nav')
        setNavFade('in')
        return false
      }
      return true
    })
  }

  const handleItemClick = (item: NavItem) => {
    onItemClick?.(item)
    handleClose()
  }

  const handleToggleAccountPanel = () => {
    if (navFade === 'out') return
    const nextMode: PanelMode = panelMode === 'account' ? 'nav' : 'account'
    setMoreIconMode(nextMode)
    setNavFade('out')
    clearFadeTimeout()
    fadeTimeoutRef.current = window.setTimeout(() => {
      setPanelMode(nextMode)
      setNavFade('in')
      fadeTimeoutRef.current = null
    }, 160)
  }

  useEffect(() => {
    return () => {
      clearFadeTimeout()
    }
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div
      className={`mobile-appbar${isScrolled || isOpen ? ' mobile-appbar--solid' : ''}`}
      data-theme={theme}
      data-open={isOpen}
      data-panel={panelMode}
    >
      <header className="mobile-appbar__bar">
        <Link to="/inicio" className="mobile-appbar__brand" aria-label="SoftPago">
          <img
            src={BRAND_SECONDARY}
            alt="SoftPago"
            className="mobile-appbar__logo"
          />
        </Link>

        <button
          type="button"
          className="mobile-appbar__toggle"
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={handleToggle}
        >
          <MorphIcon
            icon={isOpen ? X : Menu2Bars}
            size={24}
            strokeWidth={2}
            reducedMotion="user"
            aria-hidden
          />
        </button>
      </header>

      <div
        id={panelId}
        className={`mobile-appbar__panel${isOpen ? ' mobile-appbar__panel--open' : ''}`}
        role="navigation"
        aria-label={panelMode === 'account' ? 'Menú de usuario' : 'Navegación principal'}
        aria-hidden={!isOpen}
      >
        <div className="mobile-appbar__panel-inner">
          <div className="mobile-appbar__nav">
            {panelMode === 'nav' ? (
              <>
                {items.map((item, index) => {
                  const isActive = item.id === active
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`mobile-appbar__item${isActive ? ' mobile-appbar__item--active' : ''}`}
                      data-fade={navFade}
                      style={getItemFadeStyle(index)}
                      aria-current={isActive ? 'page' : undefined}
                      tabIndex={isOpen ? 0 : -1}
                      onClick={() => handleItemClick(item)}
                    >
                      <span className="mobile-appbar__item-icon">{item.icon}</span>
                      <span className="mobile-appbar__item-label">{item.title}</span>
                    </button>
                  )
                })}
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="mobile-appbar__item"
                  data-fade={navFade}
                  style={getItemFadeStyle(0)}
                  tabIndex={isOpen ? 0 : -1}
                  onClick={() => {
                    onAccountClick?.()
                    handleClose()
                  }}
                >
                  <span className="mobile-appbar__item-icon">
                    <IconAccount />
                  </span>
                  <span className="mobile-appbar__item-label">Cuenta</span>
                </button>

                <button
                  type="button"
                  className="mobile-appbar__item"
                  data-fade={navFade}
                  style={getItemFadeStyle(1)}
                  tabIndex={isOpen ? 0 : -1}
                  onClick={() => {
                    onSettingsClick?.()
                    handleClose()
                  }}
                >
                  <span className="mobile-appbar__item-icon">
                    <IconSettings />
                  </span>
                  <span className="mobile-appbar__item-label">Configuraciones</span>
                </button>

                <div
                  className="mobile-appbar__theme"
                  data-fade={navFade}
                  style={getItemFadeStyle(2)}
                  role="none"
                >
                  <span className="mobile-appbar__theme-label">{t('groupLabel')}</span>
                  <div
                    className="mobile-appbar__theme-segment"
                    role="group"
                    aria-label={t('groupLabel')}
                  >
                    <span
                      className="mobile-appbar__theme-thumb"
                      style={{
                        transform: `translateX(${selectedThemeIndex * 100}%)`,
                      }}
                      aria-hidden="true"
                    />
                    {THEME_OPTIONS.map((value) => {
                      const isSelected = themePreference === value
                      const Icon = THEME_MODE_ICONS[value]
                      return (
                        <button
                          key={value}
                          type="button"
                          className={`mobile-appbar__theme-btn${
                            isSelected ? ' mobile-appbar__theme-btn--active' : ''
                          }`}
                          aria-label={t(value)}
                          aria-pressed={isSelected}
                          tabIndex={isOpen ? 0 : -1}
                          onClick={() => onThemeChange?.(value)}
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
              </>
            )}
          </div>

          <div className="mobile-appbar__footer">
            {panelMode === 'nav' && onLogoutClick && (
              <button
                type="button"
                className="mobile-appbar__item mobile-appbar__item--danger mobile-appbar__logout"
                tabIndex={isOpen ? 0 : -1}
                onClick={() => {
                  onLogoutClick()
                  handleClose()
                }}
              >
                <span className="mobile-appbar__item-icon">
                  <IconLogout />
                </span>
                <span className="mobile-appbar__item-label">Cerrar sesión</span>
              </button>
            )}
            <div className="mobile-appbar__user-card">
              <div className="mobile-appbar__avatar" aria-hidden="true">
                {userAvatarUrl ? (
                  <img src={userAvatarUrl} alt="" />
                ) : (
                  <span className="mobile-appbar__avatar-fallback">
                    {avatarInitial}
                  </span>
                )}
              </div>
              <div className="mobile-appbar__user-meta">
                <div className="mobile-appbar__user-name-row">
                  <span className="mobile-appbar__user-name">{displayName}</span>
                  {displayRole && (
                    <span className="mobile-appbar__user-role-chip">{displayRole}</span>
                  )}
                </div>
                {userEmail && (
                  <span className="mobile-appbar__user-email">{userEmail}</span>
                )}
              </div>
              <button
                type="button"
                className={`mobile-appbar__user-more${
                  moreIconMode === 'account' ? ' mobile-appbar__user-more--active' : ''
                }`}
                aria-label={
                  moreIconMode === 'account'
                    ? 'Volver a navegación'
                    : 'Menú de usuario'
                }
                aria-pressed={moreIconMode === 'account'}
                tabIndex={isOpen ? 0 : -1}
                onClick={handleToggleAccountPanel}
              >
                <MorphIcon
                  icon={moreIconMode === 'account' ? X : EllipsisVertical}
                  size={18}
                  strokeWidth={2}
                  reducedMotion="user"
                  aria-hidden
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <button
          type="button"
          className="mobile-appbar__backdrop"
          aria-label="Cerrar menú"
          tabIndex={-1}
          onClick={handleClose}
        />
      )}
    </div>
  )
}

export default MobileAppBar

import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Alert, CircularProgress } from '@mui/material'
import {
  ArrowLeftRight,
  ArrowUpRight,
  Banknote,
  Bell,
  BellOff,
  Check,
  CircleAlert,
  CircleDollarSign,
  Eye,
  EyeOff,
  Map,
  Plus,
  Sunrise,
  Wallet,
  X,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { getAuthenticatedUserName } from '@/features/auth/services/auth.service'
import { loansService } from '@/features/loans/services/loans.service'
import { routesService } from '@/features/routes/services/routes.service'
import type { Loan } from '@/features/loans/types/loans.types'

import './HomePage.css'

interface DashboardStats {
  routes: number
  loans: number
  activeLoans: number
  totalBalance: number
  dayStart: number
  paymentsToday: number
  collected: number
}

interface OverviewTransaction {
  id: string
  name: string
  time: string
  amount: number
  initials: string
}

interface OverviewAlert {
  id: string
  clientName: string
  loanId: string
}

const HIDDEN_VALUE = '••••••'
const GROWTH_PERCENT = 40

/**
 * Formats a plain amount number without currency code.
 */
function formatAmount(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Formats a COP currency amount for list rows that keep a single string.
 */
function formatMoney(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)
}

interface MoneyFigureProps {
  value: number
  locale: string
  currencyLabel: string
  isVisible?: boolean
  size?: 'lg' | 'md'
}

/**
 * Renders amount with a de-emphasized currency code.
 */
function MoneyFigure({
  value,
  locale,
  currencyLabel,
  isVisible = true,
  size = 'lg',
}: MoneyFigureProps) {
  if (!isVisible) {
    return (
      <p className={`overview-money overview-money--${size}`}>
        <span className="overview-money__amount">{HIDDEN_VALUE}</span>
      </p>
    )
  }

  return (
    <p className={`overview-money overview-money--${size}`}>
      <span className="overview-money__amount">{formatAmount(value, locale)}</span>
      <span className="overview-money__currency">{currencyLabel}</span>
    </p>
  )
}

interface CardTitleProps {
  id: string
  title: string
  icon: LucideIcon
  trailing?: ReactNode
}

/**
 * Shared card title with equal hierarchy across overview cards.
 */
function CardTitle({ id, title, icon: Icon, trailing }: CardTitleProps) {
  return (
    <div className="overview-card__title-row">
      <div className="overview-card__title">
        <span className="overview-card__title-icon" aria-hidden>
          <Icon size={18} strokeWidth={2} />
        </span>
        <h2 id={id} className="overview-card__title-text">
          {title}
        </h2>
      </div>
      {trailing}
    </div>
  )
}

/**
 * Builds a short relative time label for prototype transactions.
 */
function formatRelativeTime(hoursAgo: number, locale: string): string {
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  if (hoursAgo < 24) {
    return formatter.format(-hoursAgo, 'hour')
  }
  return formatter.format(-Math.round(hoursAgo / 24), 'day')
}

/**
 * Derives portfolio totals from loan records for the overview cards.
 */
function buildStatsFromLoans(loans: Loan[], routeCount: number): DashboardStats {
  const activeLoans = loans.filter((loan) => loan.status === 'ACTIVE' || loan.status === 'OVERDUE')
  const totalBalance = activeLoans.reduce((sum, loan) => {
    const remainingInstallments = Math.max(
      loan.numberOfInstallments - loan.paidInstallments,
      0,
    )
    return sum + remainingInstallments * loan.installmentAmount
  }, 0)
  const collected = loans.reduce(
    (sum, loan) => sum + loan.paidInstallments * loan.installmentAmount,
    0,
  )
  const paymentsToday = activeLoans.reduce(
    (sum, loan) => sum + loan.installmentAmount,
    0,
  )
  const dayStart = totalBalance + Math.round(paymentsToday * 0.35)

  return {
    routes: routeCount,
    loans: loans.length,
    activeLoans: activeLoans.length,
    totalBalance,
    dayStart,
    paymentsToday,
    collected,
  }
}

/**
 * Builds lived-in sample transactions from loan portfolio data.
 */
function buildTransactions(loans: Loan[], locale: string): OverviewTransaction[] {
  const named = [
    { name: 'Juan Pérez', initials: 'JP' },
    { name: 'María Gómez', initials: 'MG' },
    { name: 'Luis Torres', initials: 'LT' },
    { name: 'Ana Ruiz', initials: 'AR' },
  ]

  return loans.slice(0, 4).map((loan, index) => {
    const person = named[index % named.length]
    const isIncoming = loan.status !== 'OVERDUE'
    return {
      id: loan.id,
      name: person.name,
      time: formatRelativeTime(index === 0 ? 2 : index * 8 + 3, locale),
      amount: isIncoming ? loan.installmentAmount : -loan.installmentAmount,
      initials: person.initials,
    }
  })
}

/**
 * Overview dashboard with Apple-inspired rounded cards (Balance, Resumen, Transactions).
 */
export function HomePage() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation('home/overview')
  const firstName = getAuthenticatedUserName()?.split(/\s+/)[0] || 'Usuario'
  const locale = i18n.language || 'es'

  const [stats, setStats] = useState<DashboardStats>({
    routes: 0,
    loans: 0,
    activeLoans: 0,
    totalBalance: 0,
    dayStart: 0,
    paymentsToday: 0,
    collected: 0,
  })
  const [transactions, setTransactions] = useState<OverviewTransaction[]>([])
  const [alerts, setAlerts] = useState<OverviewAlert[]>([
    {
      id: 'alert-overdue-001',
      clientName: 'Luis Torres',
      loanId: 'loan-004',
    },
  ])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isActiveVisible, setIsActiveVisible] = useState(true)
  const [isDayStartVisible, setIsDayStartVisible] = useState(true)
  const [isPaymentsVisible, setIsPaymentsVisible] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        setError('')
        const [routesResponse, loansResponse] = await Promise.all([
          routesService.getRoutes({
            page: 1,
            limit: 50,
            sortBy: 'createdAt',
            order: 'desc',
          }),
          loansService.getLoans({
            page: 1,
            limit: 50,
            sortBy: 'createdAt',
            order: 'desc',
          }),
        ])
        setStats(buildStatsFromLoans(loansResponse.data, routesResponse.meta.total))
        setTransactions(buildTransactions(loansResponse.data, locale))
      } catch (requestError) {
        const message =
          requestError instanceof Error ? requestError.message : t('loadError')
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    void loadDashboardData()
  }, [locale, t])

  const handleApproveAlert = (id: string) => {
    setAlerts((current) => current.filter((item) => item.id !== id))
  }

  const handleDeclineAlert = (id: string) => {
    setAlerts((current) => current.filter((item) => item.id !== id))
  }

  const handleViewAlertDetails = (loanId: string) => {
    navigate(`/loans/${loanId}`)
  }

  if (loading) {
    return (
      <div className="overview__loading" role="status" aria-live="polite">
        <CircularProgress />
      </div>
    )
  }

  return (
    <section className="overview" aria-label={t('balance.title')}>
      <header className="overview__header">
        <h1 className="overview__title">{t('welcome', { name: firstName })}</h1>
        <p className="overview__subtitle">{t('subtitle')}</p>
      </header>

      {error ? (
        <Alert className="overview__alert" severity="error">
          {error}
        </Alert>
      ) : null}

      <div className="overview__grid">
        <article className="overview-card overview-card--top" aria-labelledby="active-balance-title">
          <div className="overview-card__body">
            <CardTitle
              id="active-balance-title"
              title={t('activeBalance.title')}
              icon={Wallet}
            />
            <div className="overview-card__amount-row">
              <MoneyFigure
                value={stats.totalBalance}
                locale={locale}
                currencyLabel={t('balance.currency')}
                isVisible={isActiveVisible}
                size="lg"
              />
              <button
                type="button"
                className="overview-icon-btn"
                aria-label={
                  isActiveVisible ? t('activeBalance.hide') : t('activeBalance.show')
                }
                onClick={() => setIsActiveVisible((value) => !value)}
              >
                {isActiveVisible ? <Eye size={18} aria-hidden /> : <EyeOff size={18} aria-hidden />}
              </button>
            </div>
            <div className="overview-card__actions">
              <button
                type="button"
                className="overview-btn overview-btn--primary"
                onClick={() => navigate('/routes')}
              >
                {t('activeBalance.transfer')}
              </button>
              <button
                type="button"
                className="overview-btn overview-btn--ghost"
                onClick={() => navigate('/loans')}
              >
                {t('activeBalance.request')}
              </button>
            </div>
          </div>
        </article>

        <article className="overview-card overview-card--lime overview-card--top" aria-labelledby="balance-title">
          <div className="overview-card__body">
            <CardTitle
              id="balance-title"
              title={t('balance.title')}
              icon={CircleDollarSign}
              trailing={
                <button
                  type="button"
                  className="overview-icon-btn overview-icon-btn--arrow"
                  aria-label={t('balance.openPayments')}
                  onClick={() => navigate('/pagos')}
                >
                  <ArrowUpRight size={18} aria-hidden />
                </button>
              }
            />
            <div className="overview-card__amount-row">
              <MoneyFigure
                value={stats.dayStart}
                locale={locale}
                currencyLabel={t('balance.currency')}
                size="lg"
              />
              <span className="overview-badge">
                {t('balance.badge', { percent: GROWTH_PERCENT })}
              </span>
            </div>
            <div className="overview-nested">
              <div className="overview-nested__item">
                <div className="overview-nested__top">
                  <p className="overview-nested__label">{t('balance.dayStart')}</p>
                  <button
                    type="button"
                    className="overview-icon-btn"
                    aria-label={
                      isDayStartVisible
                        ? t('balance.hideMetric', { label: t('balance.dayStart') })
                        : t('balance.showMetric', { label: t('balance.dayStart') })
                    }
                    onClick={() => setIsDayStartVisible((value) => !value)}
                  >
                    {isDayStartVisible ? (
                      <Eye size={14} aria-hidden />
                    ) : (
                      <EyeOff size={14} aria-hidden />
                    )}
                  </button>
                </div>
                <div className="overview-nested__value-row">
                  <span className="overview-nested__glyph" aria-hidden>
                    <Sunrise size={16} strokeWidth={2} />
                  </span>
                  <MoneyFigure
                    value={stats.dayStart}
                    locale={locale}
                    currencyLabel={t('balance.currency')}
                    isVisible={isDayStartVisible}
                    size="md"
                  />
                </div>
              </div>
              <div className="overview-nested__item">
                <div className="overview-nested__top">
                  <p className="overview-nested__label">{t('balance.paymentsToday')}</p>
                  <button
                    type="button"
                    className="overview-icon-btn"
                    aria-label={
                      isPaymentsVisible
                        ? t('balance.hideMetric', {
                            label: t('balance.paymentsToday'),
                          })
                        : t('balance.showMetric', {
                            label: t('balance.paymentsToday'),
                          })
                    }
                    onClick={() => setIsPaymentsVisible((value) => !value)}
                  >
                    {isPaymentsVisible ? (
                      <Eye size={14} aria-hidden />
                    ) : (
                      <EyeOff size={14} aria-hidden />
                    )}
                  </button>
                </div>
                <div className="overview-nested__value-row">
                  <span className="overview-nested__glyph" aria-hidden>
                    <Banknote size={16} strokeWidth={2} />
                  </span>
                  <MoneyFigure
                    value={stats.paymentsToday}
                    locale={locale}
                    currencyLabel={t('balance.currency')}
                    isVisible={isPaymentsVisible}
                    size="md"
                  />
                </div>
              </div>
            </div>
          </div>
        </article>

        <article className="overview-card overview-card--bottom" aria-labelledby="quick-actions-title">
          <div className="overview-card__body">
            <CardTitle
              id="quick-actions-title"
              title={t('quickActions.title')}
              icon={Zap}
            />
            <div className="overview-actions">
              <button
                type="button"
                className="overview-actions__btn"
                onClick={() => navigate('/routes/new')}
              >
                <span className="overview-actions__glyph" aria-hidden>
                  <Plus size={16} strokeWidth={2.25} />
                </span>
                {t('quickActions.createRoute')}
              </button>
              <button
                type="button"
                className="overview-actions__btn"
                onClick={() => navigate('/routes')}
              >
                <span className="overview-actions__glyph" aria-hidden>
                  <Map size={16} strokeWidth={2} />
                </span>
                {t('quickActions.manageRoutes')}
              </button>
              <button
                type="button"
                className="overview-actions__btn"
                onClick={() => navigate('/loans')}
              >
                <span className="overview-actions__glyph" aria-hidden>
                  <Wallet size={16} strokeWidth={2} />
                </span>
                {t('quickActions.manageLoans')}
              </button>
            </div>
          </div>
        </article>

        <article className="overview-card overview-card--bottom" aria-labelledby="alerts-title">
          <div className="overview-card__body">
            <CardTitle
              id="alerts-title"
              title={t('alerts.title')}
              icon={Bell}
              trailing={
                <button
                  type="button"
                  className="overview-icon-btn overview-icon-btn--arrow"
                  aria-label={t('alerts.open')}
                  onClick={() => navigate('/reportes')}
                >
                  <ArrowUpRight size={18} aria-hidden />
                </button>
              }
            />
            {alerts.length === 0 ? (
              <div className="overview-empty" role="status">
                <span className="overview-empty__icon" aria-hidden>
                  <BellOff size={22} strokeWidth={1.75} />
                </span>
                <p className="overview-empty__title">{t('alerts.emptyTitle')}</p>
                <p className="overview-empty__description">
                  {t('alerts.emptyDescription')}
                </p>
              </div>
            ) : (
              <ul className="overview-alert__list">
                {alerts.map((alert) => (
                  <li key={alert.id} className="overview-alert__item">
                    <div className="overview-alert__badge" aria-hidden>
                      <CircleAlert size={20} strokeWidth={2} />
                    </div>
                    <div className="overview-alert__copy">
                      <p className="overview-alert__name">
                        {t('alerts.overdueClient')}
                      </p>
                      <p className="overview-alert__detail">
                        {t('alerts.overdueDetail', { name: alert.clientName })}
                      </p>
                    </div>
                    <div className="overview-alert__actions">
                      <button
                        type="button"
                        className="overview-tx__quick-btn overview-tx__quick-btn--eye"
                        aria-label={t('alerts.viewDetails')}
                        onClick={() => handleViewAlertDetails(alert.loanId)}
                      >
                        <Eye size={16} aria-hidden />
                      </button>
                      <button
                        type="button"
                        className="overview-tx__quick-btn overview-tx__quick-btn--ok"
                        aria-label={t('alerts.approve')}
                        onClick={() => handleApproveAlert(alert.id)}
                      >
                        <Check size={16} aria-hidden />
                      </button>
                      <button
                        type="button"
                        className="overview-tx__quick-btn overview-tx__quick-btn--no"
                        aria-label={t('alerts.decline')}
                        onClick={() => handleDeclineAlert(alert.id)}
                      >
                        <X size={16} aria-hidden />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </article>

        <article className="overview-card overview-card--bottom" aria-labelledby="transactions-title">
          <div className="overview-card__body">
            <CardTitle
              id="transactions-title"
              title={t('transactions.title')}
              icon={ArrowLeftRight}
              trailing={
                <button
                  type="button"
                  className="overview-icon-btn overview-icon-btn--arrow"
                  aria-label={t('transactions.open')}
                  onClick={() => navigate('/pagos')}
                >
                  <ArrowUpRight size={18} aria-hidden />
                </button>
              }
            />
            {transactions.length === 0 ? (
              <p className="overview-tx__empty">{t('transactions.empty')}</p>
            ) : (
              <ul className="overview-tx__list">
                {transactions.map((tx) => (
                  <li key={tx.id} className="overview-tx__item">
                    <div className="overview-tx__avatar" aria-hidden>
                      {tx.initials}
                    </div>
                    <div className="overview-tx__copy">
                      <p className="overview-tx__name">{tx.name}</p>
                      <p className="overview-tx__time">{tx.time}</p>
                    </div>
                    <p
                      className={`overview-tx__amount ${
                        tx.amount >= 0
                          ? 'overview-tx__amount--in'
                          : 'overview-tx__amount--out'
                      }`}
                    >
                      {tx.amount >= 0 ? '+' : ''}
                      {formatMoney(Math.abs(tx.amount), locale)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              className="overview-card__footer-link"
              onClick={() => navigate('/pagos')}
            >
              {t('transactions.viewAll')}
            </button>
          </div>
        </article>
      </div>
    </section>
  )
}

import { useEffect, useState, type KeyboardEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Alert, CircularProgress } from '@mui/material'
import { MorphIcon } from 'morphicons/react'
import { Eye as EyeMorph, EyeOff as EyeOffMorph } from 'lucide'
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Banknote,
  Bell,
  BellOff,
  Check,
  CircleAlert,
  Eye,
  Map,
  Plus,
  Target,
  Users,
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
  dayStartBalance: number
  incomingAmount: number
  interestProfit: number
  loanAmount: number
  newLoanCount: number
  repeatClientCount: number
  collectionTarget: number
  collectedAmount: number
}

type BalanceMetricId = 'balance' | 'incoming' | 'loan' | 'collection'

/**
 * Interest share of one installment (excludes capital repayment).
 */
function getInterestPerInstallment(loan: Loan): number {
  if (loan.numberOfInstallments <= 0) {
    return 0
  }
  const totalInterest = Math.max(loan.totalAmount - loan.amount, 0)
  return totalInterest / loan.numberOfInstallments
}

interface OverviewTransaction {
  id: string
  name: string
  time: string
  amount: number
}

interface OverviewAlert {
  id: string
  clientName: string
  loanId: string
}

/**
 * Formats a plain amount number without currency code.
 */
function formatAmount(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Formats a COP currency amount for transaction list rows.
 */
function formatMoney(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)
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

interface MoneyFigureProps {
  value: number
  locale: string
  currencyLabel: string
  size?: 'lg' | 'md'
}

/**
 * Renders amount with a de-emphasized currency code.
 */
function MoneyFigure({
  value,
  locale,
  currencyLabel,
  size = 'lg',
}: MoneyFigureProps) {
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

interface MetricVisibilityToggleProps {
  isVisible: boolean
  ariaLabel: string
  onToggle: () => void
}

/** Nested metric eye toggle with morphicons Eye ↔ EyeOff animation. */
function MetricVisibilityToggle({ isVisible, ariaLabel, onToggle }: MetricVisibilityToggleProps) {
  return (
    <button
      type="button"
      className={`overview-icon-btn overview-nested__eye${
        isVisible ? '' : ' overview-nested__eye--hidden'
      }`}
      aria-label={ariaLabel}
      aria-pressed={!isVisible}
      onClick={onToggle}
    >
      <MorphIcon
        icon={isVisible ? EyeMorph : EyeOffMorph}
        size={15}
        strokeWidth={2.25}
        spring="snappy"
        reducedMotion="user"
        aria-hidden
      />
    </button>
  )
}

interface CollectionProgressProps {
  collected: number
  target: number
  locale: string
  currencyLabel: string
  collectedLabel: string
  targetLabel: string
  progressLabel: string
  isVisible: boolean
}

/**
 * Shows daily collection progress as a labeled bar chart.
 */
function CollectionProgress({
  collected,
  target,
  locale,
  currencyLabel,
  collectedLabel,
  targetLabel,
  progressLabel,
  isVisible,
}: CollectionProgressProps) {
  const safeTarget = Math.max(target, 0)
  const safeCollected = Math.min(Math.max(collected, 0), safeTarget || collected)
  const percent =
    safeTarget > 0 ? Math.min(Math.round((safeCollected / safeTarget) * 100), 100) : 0
  const displayPercent = isVisible ? percent : 0

  return (
    <div className="overview-collection" role="group">
      <div className="overview-collection__stats">
        <div className="overview-collection__stat">
          <p className="overview-collection__label">{collectedLabel}</p>
          {isVisible ? (
            <MoneyFigure
              value={safeCollected}
              locale={locale}
              currencyLabel={currencyLabel}
              size="md"
            />
          ) : (
            <p className="overview-money overview-money--md">
              <span className="overview-money__amount">••••••</span>
              <span className="overview-money__currency">{currencyLabel}</span>
            </p>
          )}
        </div>
        <div className="overview-collection__stat overview-collection__stat--end">
          <p className="overview-collection__label">{targetLabel}</p>
          {isVisible ? (
            <MoneyFigure
              value={safeTarget}
              locale={locale}
              currencyLabel={currencyLabel}
              size="md"
            />
          ) : (
            <p className="overview-money overview-money--md">
              <span className="overview-money__amount">••••••</span>
              <span className="overview-money__currency">{currencyLabel}</span>
            </p>
          )}
        </div>
      </div>
      <div
        className={`overview-collection__track${
          isVisible ? '' : ' overview-collection__track--masked'
        }`}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={displayPercent}
        aria-label={progressLabel}
      >
        <span
          className="overview-collection__fill"
          style={{ width: isVisible ? `${percent}%` : '0%' }}
        />
      </div>
      <p className="overview-collection__percent">
        {isVisible ? `${percent}%` : '••%'}
      </p>
    </div>
  )
}

interface BalanceMetricTabProps {
  id: BalanceMetricId
  label: string
  icon: LucideIcon
  isActive: boolean
  tabOrder: readonly BalanceMetricId[]
  onSelect: (id: BalanceMetricId) => void
}

/**
 * Filled footer control that switches the balance card metric.
 */
function BalanceMetricTab({
  id,
  label,
  icon: Icon,
  isActive,
  tabOrder,
  onSelect,
}: BalanceMetricTabProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const currentIndex = tabOrder.indexOf(id)
    if (currentIndex < 0) {
      return
    }
    const focusTab = (nextId: BalanceMetricId) => {
      onSelect(nextId)
      requestAnimationFrame(() => {
        document.getElementById(`balance-tab-${nextId}`)?.focus()
      })
    }
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      focusTab(tabOrder[(currentIndex + 1) % tabOrder.length])
      return
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      focusTab(tabOrder[(currentIndex - 1 + tabOrder.length) % tabOrder.length])
      return
    }
    if (event.key === 'Home') {
      event.preventDefault()
      focusTab(tabOrder[0])
      return
    }
    if (event.key === 'End') {
      event.preventDefault()
      focusTab(tabOrder[tabOrder.length - 1])
    }
  }

  return (
    <button
      type="button"
      role="tab"
      id={`balance-tab-${id}`}
      aria-selected={isActive}
      aria-controls="balance-metric-panel"
      tabIndex={isActive ? 0 : -1}
      className={`overview-balance-tab${isActive ? ' overview-balance-tab--active' : ''}`}
      onClick={() => onSelect(id)}
      onKeyDown={handleKeyDown}
    >
      <span className="overview-balance-tab__glyph" aria-hidden>
        <Icon size={15} strokeWidth={2.25} />
      </span>
      <span className="overview-balance-tab__label">{label}</span>
    </button>
  )
}

interface KpiCardProps {
  id: string
  title: string
  icon: LucideIcon
  children: ReactNode
  href: string
  onNavigate: (path: string) => void
}

/**
 * Compact summary metric for the overview KPI strip.
 * Activates navigation to the linked management page.
 */
function KpiCard({
  id,
  title,
  icon: Icon,
  children,
  href,
  onNavigate,
}: KpiCardProps) {
  const handleActivate = () => {
    onNavigate(href)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleActivate()
    }
  }

  return (
    <article
      className="overview-card overview-card--kpi overview-card--kpi-link"
      aria-labelledby={id}
      role="button"
      tabIndex={0}
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
    >
      <div className="overview-card__body overview-card__body--kpi">
        <div className="overview-kpi__head">
          <span className="overview-kpi__glyph" aria-hidden>
            <Icon size={16} strokeWidth={2} />
          </span>
          <h2 id={id} className="overview-kpi__title">
            {title}
          </h2>
        </div>
        <div className="overview-kpi__value">{children}</div>
      </div>
    </article>
  )
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
  const collectionTarget = activeLoans.reduce(
    (sum, loan) => sum + loan.installmentAmount,
    0,
  )
  const loansPerBorrower = loans.reduce<Record<string, number>>((counts, loan) => {
    counts[loan.borrowerId] = (counts[loan.borrowerId] ?? 0) + 1
    return counts
  }, {})
  // Prototype cashflow until a payments ledger API exists.
  const receivedToday = activeLoans.filter((_, index) => index % 2 === 0)
  const disbursedToday = activeLoans.filter((_, index) => index % 2 === 1)
  const incomingAmount = receivedToday.reduce(
    (sum, loan) => sum + loan.installmentAmount,
    0,
  )
  const interestProfit = Math.round(
    receivedToday.reduce((sum, loan) => sum + getInterestPerInstallment(loan), 0),
  )
  const loanAmount = disbursedToday.reduce((sum, loan) => sum + loan.amount, 0)
  const newLoanCount = disbursedToday.filter(
    (loan) => (loansPerBorrower[loan.borrowerId] ?? 0) <= 1,
  ).length
  const repeatClientCount = disbursedToday.filter(
    (loan) => (loansPerBorrower[loan.borrowerId] ?? 0) > 1,
  ).length
  const collectedAmount = incomingAmount
  const dayStartBalance = totalBalance - incomingAmount + loanAmount

  return {
    routes: routeCount,
    loans: loans.length,
    activeLoans: activeLoans.length,
    totalBalance,
    dayStartBalance,
    incomingAmount,
    interestProfit,
    loanAmount,
    newLoanCount,
    repeatClientCount,
    collectionTarget,
    collectedAmount,
  }
}

/**
 * Builds lived-in sample transactions from loan portfolio data.
 */
function buildTransactions(loans: Loan[], locale: string): OverviewTransaction[] {
  const names = ['Juan Pérez', 'María Gómez', 'Luis Torres', 'Ana Ruiz']

  return loans.slice(0, 4).map((loan, index) => {
    const isIncoming = loan.status !== 'OVERDUE'
    return {
      id: loan.id,
      name: names[index % names.length],
      time: formatRelativeTime(index === 0 ? 2 : index * 8 + 3, locale),
      amount: isIncoming ? loan.installmentAmount : -loan.installmentAmount,
    }
  })
}

/**
 * Overview dashboard: two columns — balance/KPIs/transactions | alerts/actions.
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
    dayStartBalance: 0,
    incomingAmount: 0,
    interestProfit: 0,
    loanAmount: 0,
    newLoanCount: 0,
    repeatClientCount: 0,
    collectionTarget: 0,
    collectedAmount: 0,
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
  const [isBalanceVisible, setIsBalanceVisible] = useState(true)
  const [activeBalanceMetric, setActiveBalanceMetric] =
    useState<BalanceMetricId>('balance')

  const balanceMetricTabs = [
    {
      id: 'balance' as const,
      label: t('balance.myBalance'),
      cardTitle: t('balance.title'),
      icon: Wallet,
    },
    {
      id: 'incoming' as const,
      label: t('balance.incoming'),
      cardTitle: t('balance.incoming'),
      icon: ArrowDownLeft,
    },
    {
      id: 'loan' as const,
      label: t('balance.loan'),
      cardTitle: t('balance.loan'),
      icon: Banknote,
    },
    {
      id: 'collection' as const,
      label: t('balance.collection'),
      cardTitle: t('balance.collection'),
      icon: Target,
    },
  ]
  const balanceMetricOrder = balanceMetricTabs.map((tab) => tab.id)
  const activeBalanceTab =
    balanceMetricTabs.find((tab) => tab.id === activeBalanceMetric) ??
    balanceMetricTabs[0]
  const visibilityToggleLabel = isBalanceVisible
    ? t('balance.hideMetric', { label: activeBalanceTab.cardTitle })
    : t('balance.showMetric', { label: activeBalanceTab.cardTitle })
  const metricAmount =
    activeBalanceMetric === 'incoming'
      ? stats.incomingAmount
      : activeBalanceMetric === 'loan'
        ? stats.loanAmount
        : stats.totalBalance

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
    <section className="overview" aria-label={t('welcome', { name: firstName })}>
      <header className="overview__header">
        <h1 className="overview__title">{t('welcome', { name: firstName })}</h1>
        <p className="overview__subtitle">{t('subtitle')}</p>
      </header>

      {error ? (
        <Alert className="overview__alert" severity="error">
          {error}
        </Alert>
      ) : null}

      <div className="overview__layout">
        <div className="overview__col overview__col--main">
          <article
            className="overview-card overview-card--lime overview-card--balance"
            aria-labelledby="balance-title"
          >
            <img
              src="/favicon.svg"
              alt=""
              className="overview-card__watermark"
              aria-hidden
            />
            <div className="overview-card__body overview-card__body--balance">
              <CardTitle
                id="balance-title"
                title={activeBalanceTab.cardTitle}
                icon={activeBalanceTab.icon}
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
              <div
                id="balance-metric-panel"
                role="tabpanel"
                aria-labelledby={`balance-tab-${activeBalanceMetric}`}
                className="overview-card__metric-panel"
              >
                {activeBalanceMetric === 'collection' ? (
                  <div className="overview-card__amount-row overview-card__amount-row--collection">
                    <CollectionProgress
                      collected={stats.collectedAmount}
                      target={stats.collectionTarget}
                      locale={locale}
                      currencyLabel={t('balance.currency')}
                      collectedLabel={t('balance.collected')}
                      targetLabel={t('balance.toCollect')}
                      progressLabel={t('balance.progressLabel', {
                        percent:
                          stats.collectionTarget > 0
                            ? Math.min(
                                Math.round(
                                  (stats.collectedAmount /
                                    stats.collectionTarget) *
                                    100,
                                ),
                                100,
                              )
                            : 0,
                      })}
                      isVisible={isBalanceVisible}
                    />
                    <MetricVisibilityToggle
                      isVisible={isBalanceVisible}
                      ariaLabel={visibilityToggleLabel}
                      onToggle={() =>
                        setIsBalanceVisible((current) => !current)
                      }
                    />
                  </div>
                ) : (
                  <div className="overview-card__metric-stack">
                    <div className="overview-card__amount-row">
                      {isBalanceVisible ? (
                        <MoneyFigure
                          value={metricAmount}
                          locale={locale}
                          currencyLabel={t('balance.currency')}
                          size="lg"
                        />
                      ) : (
                        <p className="overview-money overview-money--lg">
                          <span className="overview-money__amount">••••••</span>
                          <span className="overview-money__currency">
                            {t('balance.currency')}
                          </span>
                        </p>
                      )}
                      <MetricVisibilityToggle
                        isVisible={isBalanceVisible}
                        ariaLabel={visibilityToggleLabel}
                        onToggle={() =>
                          setIsBalanceVisible((current) => !current)
                        }
                      />
                    </div>
                    <p
                      className={`overview-balance-sub${
                        activeBalanceMetric === 'balance' ||
                        activeBalanceMetric === 'incoming' ||
                        activeBalanceMetric === 'loan'
                          ? ''
                          : ' overview-balance-sub--placeholder'
                      }`}
                    >
                      {activeBalanceMetric === 'balance' ? (
                        <>
                          <span className="overview-balance-sub__label">
                            {t('balance.dayStart')}
                          </span>
                          {isBalanceVisible ? (
                            <span className="overview-balance-sub__value">
                              {formatAmount(stats.dayStartBalance, locale)}{' '}
                              <span className="overview-balance-sub__currency">
                                {t('balance.currency')}
                              </span>
                            </span>
                          ) : (
                            <span className="overview-balance-sub__value">
                              ••••••{' '}
                              <span className="overview-balance-sub__currency">
                                {t('balance.currency')}
                              </span>
                            </span>
                          )}
                        </>
                      ) : null}
                      {activeBalanceMetric === 'incoming' ? (
                        <>
                          <span className="overview-balance-sub__label">
                            {t('balance.profit')}
                          </span>
                          {isBalanceVisible ? (
                            <span className="overview-balance-sub__value">
                              {formatAmount(stats.interestProfit, locale)}{' '}
                              <span className="overview-balance-sub__currency">
                                {t('balance.currency')}
                              </span>
                            </span>
                          ) : (
                            <span className="overview-balance-sub__value">
                              ••••••{' '}
                              <span className="overview-balance-sub__currency">
                                {t('balance.currency')}
                              </span>
                            </span>
                          )}
                        </>
                      ) : null}
                      {activeBalanceMetric === 'loan' ? (
                        <>
                          <span className="overview-balance-sub__label">
                            {t('balance.newLoans')}
                          </span>
                          <span className="overview-balance-sub__value">
                            {stats.newLoanCount}
                          </span>
                          <span className="overview-balance-sub__sep" aria-hidden>
                            |
                          </span>
                          <span className="overview-balance-sub__label">
                            {t('balance.repeatClients')}
                          </span>
                          <span className="overview-balance-sub__value">
                            {stats.repeatClientCount}
                          </span>
                        </>
                      ) : null}
                    </p>
                  </div>
                )}
              </div>
              <div
                className="overview-balance-tabs"
                role="tablist"
                aria-label={t('balance.title')}
              >
                {balanceMetricTabs.map((tab) => (
                  <BalanceMetricTab
                    key={tab.id}
                    id={tab.id}
                    label={tab.label}
                    icon={tab.icon}
                    isActive={activeBalanceMetric === tab.id}
                    tabOrder={balanceMetricOrder}
                    onSelect={setActiveBalanceMetric}
                  />
                ))}
              </div>
            </div>
          </article>

          <div className="overview-kpi-row">
            <KpiCard
              id="kpi-routes-title"
              title={t('kpis.routes')}
              icon={Map}
              href="/routes"
              onNavigate={navigate}
            >
              <span className="overview-kpi__number">{stats.routes}</span>
            </KpiCard>
            <KpiCard
              id="kpi-clients-title"
              title={t('kpis.clients')}
              icon={Users}
              href="/loans"
              onNavigate={navigate}
            >
              <span className="overview-kpi__number">{stats.loans}</span>
            </KpiCard>
            <KpiCard
              id="kpi-loans-title"
              title={t('kpis.loanMoney')}
              icon={Wallet}
              href="/loans"
              onNavigate={navigate}
            >
              <MoneyFigure
                value={stats.totalBalance}
                locale={locale}
                currencyLabel={t('balance.currency')}
                size="md"
              />
            </KpiCard>
          </div>

          <article
            className="overview-card overview-card--transactions"
            aria-labelledby="transactions-title"
          >
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
                  {transactions.map((tx) => {
                    const isIncoming = tx.amount >= 0
                    const TxIcon = isIncoming ? ArrowDownLeft : ArrowUpRight
                    return (
                      <li key={tx.id} className="overview-tx__item">
                        <div
                          className={`overview-tx__avatar ${
                            isIncoming
                              ? 'overview-tx__avatar--in'
                              : 'overview-tx__avatar--out'
                          }`}
                          aria-hidden
                        >
                          <TxIcon size={18} strokeWidth={2.25} />
                        </div>
                        <div className="overview-tx__copy">
                          <p className="overview-tx__name">{tx.name}</p>
                          <p className="overview-tx__time">{tx.time}</p>
                        </div>
                        <p
                          className={`overview-tx__amount ${
                            isIncoming
                              ? 'overview-tx__amount--in'
                              : 'overview-tx__amount--out'
                          }`}
                        >
                          {isIncoming ? '+' : ''}
                          {formatMoney(Math.abs(tx.amount), locale)}
                        </p>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </article>
        </div>

        <div className="overview__col overview__col--side">
          <article
            className="overview-card overview-card--alerts"
            aria-labelledby="alerts-title"
          >
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

          <article
            className="overview-card overview-card--actions"
            aria-labelledby="quick-actions-title"
          >
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
        </div>
      </div>
    </section>
  )
}

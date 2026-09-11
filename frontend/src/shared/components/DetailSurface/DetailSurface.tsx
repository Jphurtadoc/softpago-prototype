import type { KeyboardEvent, ReactNode } from 'react'

import './DetailSurface.css'

export interface DetailSurfaceProps {
  /** Page body content */
  readonly children: ReactNode
  /** Extra class names on the root */
  readonly className?: string
  /** Accessible label for the detail landmark */
  readonly ariaLabel?: string
}

/**
 * Dashboard detail page shell with shared surface tokens and dark-mode support.
 */
export function DetailSurface({
  children,
  className,
  ariaLabel,
}: DetailSurfaceProps) {
  const rootClassName =
    className != null && className !== ''
      ? `detail-surface ${className}`
      : 'detail-surface'

  return (
    <section className={rootClassName} aria-label={ariaLabel}>
      {children}
    </section>
  )
}

export interface DetailMetricProps {
  readonly icon: ReactNode
  readonly label: string
  readonly value: ReactNode
  readonly hint?: ReactNode
}

/**
 * Compact KPI tile for detail page summaries.
 */
export function DetailMetric({ icon, label, value, hint }: DetailMetricProps) {
  return (
    <article className="detail-surface__metric">
      <div className="detail-surface__metric-head">
        <span className="detail-surface__metric-icon" aria-hidden>
          {icon}
        </span>
        <p className="detail-surface__metric-label">{label}</p>
      </div>
      <p className="detail-surface__metric-value">{value}</p>
      {hint != null && hint !== '' ? (
        <p className="detail-surface__metric-hint">{hint}</p>
      ) : null}
    </article>
  )
}

export interface DetailSectionProps {
  readonly icon: ReactNode
  readonly title: string
  readonly description?: string
  readonly actions?: ReactNode
  readonly children: ReactNode
  readonly wide?: boolean
  readonly titleId?: string
}

/**
 * Card section with icon title and optional actions.
 */
export function DetailSection({
  icon,
  title,
  description,
  actions,
  children,
  wide = false,
  titleId,
}: DetailSectionProps) {
  const sectionClassName = wide
    ? 'detail-surface__section detail-surface__section--wide'
    : 'detail-surface__section'
  const headingId =
    titleId ?? `detail-section-${title.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <section className={sectionClassName} aria-labelledby={headingId}>
      <div className="detail-surface__section-head">
        <div className="detail-surface__section-title-row">
          <span className="detail-surface__section-icon" aria-hidden>
            {icon}
          </span>
          <div className="detail-surface__section-copy">
            <h2 id={headingId} className="detail-surface__section-title">
              {title}
            </h2>
            {description != null && description !== '' ? (
              <p className="detail-surface__section-desc">{description}</p>
            ) : null}
          </div>
        </div>
        {actions != null ? actions : null}
      </div>
      {children}
    </section>
  )
}

export interface DetailFieldProps {
  readonly label: string
  readonly value: ReactNode
  readonly icon?: ReactNode
}

/**
 * Labeled value cell inside a detail section.
 */
export function DetailField({ label, value, icon }: DetailFieldProps) {
  return (
    <div className="detail-surface__field">
      <p className="detail-surface__field-label">
        {icon != null ? <span aria-hidden>{icon}</span> : null}
        {label}
      </p>
      <p className="detail-surface__field-value">{value}</p>
    </div>
  )
}

export interface DetailProgressProps {
  readonly value: number
  readonly max: number
  readonly label: string
  readonly meta?: string
}

/**
 * Installment / completion progress bar for detail heroes.
 */
export function DetailProgress({
  value,
  max,
  label,
  meta,
}: DetailProgressProps) {
  const safeMax = max > 0 ? max : 1
  const percent = Math.min(Math.round((value / safeMax) * 100), 100)
  const valueText = meta ?? `${value} / ${max}`

  return (
    <div
      className="detail-surface__progress"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuetext={valueText}
      aria-label={label}
    >
      <div className="detail-surface__progress-track">
        <div
          className="detail-surface__progress-fill"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="detail-surface__progress-meta">
        <span>{label}</span>
        <span>{valueText}</span>
      </div>
    </div>
  )
}

export default DetailSurface

export interface DetailTabItem {
  readonly id: string
  readonly label: string
  readonly icon?: ReactNode
  readonly count?: number
}

export interface DetailTabsProps {
  readonly tabs: readonly DetailTabItem[]
  readonly activeTab: string
  readonly onChange: (tabId: string) => void
  readonly ariaLabel: string
  /** Prefix for tab/panel ids. Defaults to `detail-tab`. */
  readonly idPrefix?: string
}

/**
 * Horizontal detail tabs placed under KPI metrics.
 */
export function DetailTabs({
  tabs,
  activeTab,
  onChange,
  ariaLabel,
  idPrefix = 'detail-tab',
}: DetailTabsProps) {
  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (tabs.length === 0) {
      return
    }
    let nextIndex = index
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      nextIndex = (index + 1) % tabs.length
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      nextIndex = (index - 1 + tabs.length) % tabs.length
    } else if (event.key === 'Home') {
      event.preventDefault()
      nextIndex = 0
    } else if (event.key === 'End') {
      event.preventDefault()
      nextIndex = tabs.length - 1
    } else {
      return
    }
    onChange(tabs[nextIndex].id)
  }

  return (
    <div className="detail-surface__tabs" role="tablist" aria-label={ariaLabel}>
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`${idPrefix}-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`${idPrefix}-panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            className={
              isActive
                ? 'detail-surface__tab detail-surface__tab--active'
                : 'detail-surface__tab'
            }
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {tab.icon != null ? (
              <span className="detail-surface__tab-icon" aria-hidden>
                {tab.icon}
              </span>
            ) : null}
            <span className="detail-surface__tab-label">{tab.label}</span>
            {typeof tab.count === 'number' ? (
              <span className="detail-surface__tab-count">{tab.count}</span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

export interface DetailTabPanelProps {
  readonly tabId: string
  readonly activeTab: string
  readonly children: ReactNode
  readonly idPrefix?: string
}

/**
 * Tab panel that mounts content only while its tab is active.
 */
export function DetailTabPanel({
  tabId,
  activeTab,
  children,
  idPrefix = 'detail-tab',
}: DetailTabPanelProps) {
  if (tabId !== activeTab) {
    return null
  }

  return (
    <div
      className="detail-surface__tab-panel"
      role="tabpanel"
      id={`${idPrefix}-panel-${tabId}`}
      aria-labelledby={`${idPrefix}-${tabId}`}
    >
      {children}
    </div>
  )
}

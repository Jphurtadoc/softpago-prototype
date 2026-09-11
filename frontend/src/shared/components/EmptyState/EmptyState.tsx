import type { ReactNode } from 'react'

import './EmptyState.css'

export interface EmptyStateProps {
  /** Visual mark above the title */
  readonly icon: ReactNode
  /** Primary empty-state message */
  readonly title: string
  /** Optional supporting copy under the title */
  readonly description?: string
  /** Extra class names on the root */
  readonly className?: string
}

/**
 * Full-area empty placeholder with icon and title for dashboard pages.
 */
export function EmptyState({
  icon,
  title,
  description,
  className,
}: EmptyStateProps) {
  const rootClassName =
    className != null && className !== ''
      ? `empty-state ${className}`
      : 'empty-state'

  return (
    <div className={rootClassName} role="status">
      <span className="empty-state__icon" aria-hidden>
        {icon}
      </span>
      <p className="empty-state__title">{title}</p>
      {description != null && description !== '' ? (
        <p className="empty-state__description">{description}</p>
      ) : null}
    </div>
  )
}

export default EmptyState

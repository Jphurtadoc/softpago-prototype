import type { CSSProperties, ReactNode, RefObject } from 'react';
import { createPortal } from 'react-dom';

export interface DataTableMenuSurfaceProps {
  readonly anchor: HTMLElement | null;
  readonly open: boolean;
  readonly align?: 'start' | 'end';
  readonly width?: number;
  readonly theme?: 'light' | 'dark';
  readonly className: string;
  readonly id?: string;
  readonly role?: string;
  readonly 'aria-label'?: string;
  readonly children: ReactNode;
  readonly menuRef?: RefObject<HTMLDivElement | null>;
}

/**
 * Positions a dropdown with fixed coords and portals it to document.body
 * so overflow parents cannot clip it.
 */
export function DataTableMenuSurface({
  anchor,
  open,
  align = 'end',
  width = 200,
  theme,
  className,
  id,
  role,
  'aria-label': ariaLabel,
  children,
  menuRef,
}: DataTableMenuSurfaceProps) {
  if (!open || !anchor || typeof document === 'undefined') {
    return null;
  }

  const rect = anchor.getBoundingClientRect();
  const gap = 6;
  const maxWidth = Math.min(width, window.innerWidth - 16);
  let left = align === 'end' ? rect.right - maxWidth : rect.left;
  left = Math.max(8, Math.min(left, window.innerWidth - maxWidth - 8));

  let top = rect.bottom + gap;
  const estimatedHeight = 280;
  if (top + estimatedHeight > window.innerHeight - 8) {
    top = Math.max(8, rect.top - gap - Math.min(estimatedHeight, rect.top - 8));
  }

  const style: CSSProperties = {
    position: 'fixed',
    top,
    left,
    width: maxWidth,
    zIndex: 1400,
  };

  const resolvedTheme =
    theme ??
    (document.querySelector('.app')?.getAttribute('data-theme') as
      | 'light'
      | 'dark'
      | null) ??
    'light';

  return createPortal(
    <div className="data-table" data-theme={resolvedTheme}>
      <div
        ref={menuRef}
        id={id}
        className={`${className} data-table__menu--portal`}
        role={role}
        aria-label={ariaLabel}
        style={style}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

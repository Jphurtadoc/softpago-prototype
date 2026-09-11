import type { DataTableTone } from './data-table.types';
import './DataTable.css';

export interface DataTableStatusChipProps {
  readonly label: string;
  readonly tone?: DataTableTone;
  readonly className?: string;
}

/**
 * Compact status chip that shares tone tokens with DataTable tabs.
 */
export function DataTableStatusChip({
  label,
  tone = 'neutral',
  className,
}: DataTableStatusChipProps) {
  const classNames = [
    'data-table__chip',
    `data-table__chip--${tone}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <span className={classNames}>{label}</span>;
}

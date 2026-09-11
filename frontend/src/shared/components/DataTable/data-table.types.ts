import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

/**
 * Column definition for a typed data row.
 */
export interface DataTableColumn<T> {
  readonly key: string;
  readonly header: string;
  readonly render: (item: T) => ReactNode;
  readonly width?: string;
  readonly align?: 'left' | 'center' | 'right';
}

/**
 * Row action shown in the overflow (three-dot) menu.
 * Prefer `getHref` for navigation actions; use `onClick` for side effects.
 */
export interface DataTableAction<T> {
  readonly id: string;
  readonly label: string;
  readonly onClick?: (item: T) => void;
  readonly getHref?: (item: T) => string;
  readonly icon?: LucideIcon;
  readonly danger?: boolean;
  readonly disabled?: (item: T) => boolean;
}

/**
 * Single option inside a filter accordion.
 */
export interface DataTableFilterOption {
  readonly value: string;
  readonly label: string;
  readonly icon?: LucideIcon;
}

/**
 * Filter group rendered as an accordion panel.
 */
export interface DataTableFilter {
  readonly id: string;
  readonly label: string;
  readonly options: DataTableFilterOption[];
  readonly multiple?: boolean;
  readonly icon?: LucideIcon;
}

/**
 * Semantic tone shared by status chips and status tabs.
 */
export type DataTableTone =
  | 'neutral'
  | 'brand'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

/**
 * Status tab used above the table grid.
 */
export interface DataTableStatusTab {
  readonly id: string;
  readonly label: string;
  readonly count?: number;
  readonly tone?: DataTableTone;
}

export type DataTableFilterValues = Record<string, string | string[]>;

/**
 * Props for the shared DataTable surface.
 */
export interface DataTableProps<T> {
  readonly columns: DataTableColumn<T>[];
  readonly data: T[];
  readonly rowKey: (item: T) => string;
  readonly loading?: boolean;
  readonly emptyMessage?: string;
  readonly searchValue?: string;
  readonly searchPlaceholder?: string;
  readonly onSearchChange?: (value: string) => void;
  readonly filters?: DataTableFilter[];
  readonly filterValues?: DataTableFilterValues;
  readonly onFilterChange?: (filterId: string, value: string | string[]) => void;
  readonly onClearFilters?: () => void;
  readonly filtersLabel?: string;
  readonly clearFiltersLabel?: string;
  readonly statusTabs?: DataTableStatusTab[];
  readonly activeStatusTab?: string;
  readonly onStatusTabChange?: (tabId: string) => void;
  readonly selectable?: boolean;
  readonly selectedKeys?: string[];
  readonly onSelectionChange?: (keys: string[]) => void;
  readonly actions?: DataTableAction<T>[];
  readonly actionsAriaLabel?: string;
  readonly getActionsAriaLabel?: (item: T) => string;
  /**
   * When set, clicking a row navigates to the returned path
   * (checkbox, action menu, and nested controls are ignored).
   */
  readonly getRowHref?: (item: T) => string | undefined;
  readonly page: number;
  readonly rowsPerPage: number;
  readonly total: number;
  readonly rowsPerPageOptions?: number[];
  readonly onPageChange: (page: number) => void;
  readonly onRowsPerPageChange: (rowsPerPage: number) => void;
  readonly theme?: 'light' | 'dark';
  readonly className?: string;
  readonly regionLabel?: string;
  readonly statusTabsLabel?: string;
  readonly loadingLabel?: string;
  readonly previousPageLabel?: string;
  readonly nextPageLabel?: string;
  readonly rowsPerPageLabel?: string;
  readonly selectedCountLabel?: (count: number) => string;
  readonly rangeLabel?: (start: number, end: number, total: number) => string;
}

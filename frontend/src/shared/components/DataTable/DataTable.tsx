import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, EllipsisVertical, ListFilter, Search } from 'lucide-react';
import type { DataTableProps } from './data-table.types';
import { DataTableMenuSurface } from './DataTableMenuSurface';
import './DataTable.css';

const DEFAULT_ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50] as const;
/** Hide pagination footer when total rows are below this threshold. */
const MIN_ROWS_FOR_PAGINATION_FOOTER = 5;

/**
 * Counts active filter selections for the toolbar badge.
 */
function countActiveFilters(
  filters: DataTableProps<unknown>['filters'],
  filterValues: DataTableProps<unknown>['filterValues'],
): number {
  if (!filters?.length || !filterValues) return 0;
  return filters.reduce((total, filter) => {
    const value = filterValues[filter.id];
    if (Array.isArray(value)) return total + value.length;
    if (typeof value === 'string' && value.length > 0) return total + 1;
    return total;
  }, 0);
}

/**
 * Builds a compact page number list with ellipsis gaps.
 */
function buildPageList(currentPage: number, pageCount: number): Array<number | 'gap'> {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index);
  }
  const pages = new Set<number>([0, pageCount - 1, currentPage]);
  if (currentPage > 0) pages.add(currentPage - 1);
  if (currentPage < pageCount - 1) pages.add(currentPage + 1);
  if (currentPage <= 2) {
    pages.add(2);
    pages.add(3);
  }
  if (currentPage >= pageCount - 3) {
    pages.add(pageCount - 3);
    pages.add(pageCount - 4);
  }
  const sorted = [...pages].filter((page) => page >= 0 && page < pageCount).sort((a, b) => a - b);
  const result: Array<number | 'gap'> = [];
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) result.push('gap');
    result.push(page);
  });
  return result;
}

/**
 * Shared data table with search, accordion filters, status tabs,
 * multi-select, row actions menu, and footer pagination.
 */
export function DataTable<T>({
  columns,
  data,
  rowKey,
  loading = false,
  emptyMessage = 'No records found',
  searchValue = '',
  searchPlaceholder = 'Search…',
  onSearchChange,
  filters = [],
  filterValues = {},
  onFilterChange,
  onClearFilters,
  filtersLabel = 'Filters',
  clearFiltersLabel = 'Clear',
  statusTabs = [],
  activeStatusTab,
  onStatusTabChange,
  selectable = false,
  selectedKeys = [],
  onSelectionChange,
  actions = [],
  actionsAriaLabel = 'Row actions',
  getActionsAriaLabel,
  getRowHref,
  page,
  rowsPerPage,
  total,
  rowsPerPageOptions = [...DEFAULT_ROWS_PER_PAGE_OPTIONS],
  onPageChange,
  onRowsPerPageChange,
  theme,
  className,
  regionLabel = 'Data table',
  statusTabsLabel = 'Status',
  loadingLabel = 'Loading…',
  previousPageLabel = 'Prev',
  nextPageLabel = 'Next',
  rowsPerPageLabel = 'Rows',
  selectedCountLabel = (count) => `${count} selected`,
  rangeLabel = (start, end, totalCount) => `${start}–${end} of ${totalCount}`,
}: DataTableProps<T>) {
  const navigate = useNavigate();
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const actionsMenuRef = useRef<HTMLDivElement>(null);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);
  const [actionsAnchor, setActionsAnchor] = useState<HTMLElement | null>(null);
  const [openAccordionId, setOpenAccordionId] = useState<string | null>(
    filters[0]?.id ?? null,
  );
  const [openActionsRowKey, setOpenActionsRowKey] = useState<string | null>(null);

  const pageKeys = useMemo(() => data.map((item) => rowKey(item)), [data, rowKey]);
  const selectedSet = useMemo(() => new Set(selectedKeys), [selectedKeys]);
  const selectedOnPage = pageKeys.filter((key) => selectedSet.has(key));
  const isAllPageSelected =
    pageKeys.length > 0 && selectedOnPage.length === pageKeys.length;
  const isSomePageSelected =
    selectedOnPage.length > 0 && selectedOnPage.length < pageKeys.length;
  const activeFilterCount = countActiveFilters(filters, filterValues);
  const pageCount = Math.max(1, Math.ceil(total / Math.max(rowsPerPage, 1)));
  const safePage = Math.min(Math.max(page, 0), pageCount - 1);
  const rangeStart = total === 0 ? 0 : safePage * rowsPerPage + 1;
  const rangeEnd = Math.min(total, (safePage + 1) * rowsPerPage);
  const pageList = buildPageList(safePage, pageCount);
  const colSpan =
    columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0);
  const showToolbar = Boolean(onSearchChange) || filters.length > 0;
  const showPaginationFooter = total >= MIN_ROWS_FOR_PAGINATION_FOOTER;

  const closeMenus = useCallback(() => {
    setIsFilterMenuOpen(false);
    setFilterAnchor(null);
    setOpenActionsRowKey(null);
    setActionsAnchor(null);
  }, []);

  const lastSyncedPageRef = useRef<number | null>(null);
  useEffect(() => {
    if (page === safePage) {
      lastSyncedPageRef.current = null;
      return;
    }
    if (lastSyncedPageRef.current === safePage) return;
    lastSyncedPageRef.current = safePage;
    onPageChange(safePage);
  }, [onPageChange, page, safePage]);

  useEffect(() => {
    if (filters.length === 0) {
      setOpenAccordionId(null);
      return;
    }
    setOpenAccordionId((current) =>
      current && filters.some((filter) => filter.id === current)
        ? current
        : (filters[0]?.id ?? null),
    );
  }, [filters]);

  useEffect(() => {
    if (!isFilterMenuOpen && openActionsRowKey === null) return;
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (filterButtonRef.current?.contains(target)) return;
      if (filterMenuRef.current?.contains(target)) return;
      if (actionsAnchor?.contains(target)) return;
      if (actionsMenuRef.current?.contains(target)) return;
      closeMenus();
    };
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') closeMenus();
    };
    const handleViewportChange = () => {
      closeMenus();
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, true);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
    };
  }, [actionsAnchor, closeMenus, isFilterMenuOpen, openActionsRowKey]);

  const handleToggleAll = () => {
    if (!onSelectionChange) return;
    if (isAllPageSelected) {
      onSelectionChange(selectedKeys.filter((key) => !pageKeys.includes(key)));
      return;
    }
    const merged = new Set(selectedKeys);
    pageKeys.forEach((key) => merged.add(key));
    onSelectionChange([...merged]);
  };

  const handleToggleRow = (key: string) => {
    if (!onSelectionChange) return;
    if (selectedSet.has(key)) {
      onSelectionChange(selectedKeys.filter((item) => item !== key));
      return;
    }
    onSelectionChange([...selectedKeys, key]);
  };

  const handleFilterOptionChange = (
    filterId: string,
    optionValue: string,
    multiple: boolean,
  ) => {
    if (!onFilterChange) return;
    if (!multiple) {
      const current = filterValues[filterId];
      onFilterChange(filterId, current === optionValue ? '' : optionValue);
      return;
    }
    const current = filterValues[filterId];
    const selected = Array.isArray(current) ? current : [];
    if (selected.includes(optionValue)) {
      onFilterChange(
        filterId,
        selected.filter((value) => value !== optionValue),
      );
      return;
    }
    onFilterChange(filterId, [...selected, optionValue]);
  };

  const handleStatusTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    tabIndex: number,
  ) => {
    if (statusTabs.length === 0 || !onStatusTabChange) return;
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const delta = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (tabIndex + delta + statusTabs.length) % statusTabs.length;
    const nextTab = statusTabs[nextIndex];
    if (!nextTab) return;
    onStatusTabChange(nextTab.id);
    const nextButton = rootRef.current?.querySelector<HTMLButtonElement>(
      `[data-status-tab="${nextTab.id}"]`,
    );
    nextButton?.focus();
  };

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onRowsPerPageChange(Number(event.target.value));
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' && searchValue && onSearchChange) {
      onSearchChange('');
    }
  };

  const handleRowNavigate = (
    event: ReactMouseEvent<HTMLTableRowElement> | KeyboardEvent<HTMLTableRowElement>,
    item: T,
  ) => {
    const href = getRowHref?.(item);
    if (!href) return;
    const target = event.target as HTMLElement | null;
    if (
      target?.closest(
        'a, button, input, label, textarea, select, .data-table__actions-wrap',
      )
    ) {
      return;
    }
    navigate(href);
  };

  const rootClassName = ['data-table', className].filter(Boolean).join(' ');

  return (
    <div
      ref={rootRef}
      className={rootClassName}
      data-theme={theme}
      role="region"
      aria-label={regionLabel}
    >
      {showToolbar && (
        <div className="data-table__toolbar">
          {onSearchChange && (
            <div className="data-table__search">
              <Search className="data-table__search-icon" aria-hidden="true" />
              <input
                id={`${baseId}-search`}
                className="data-table__search-input"
                type="search"
                value={searchValue}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                onChange={(event) => onSearchChange(event.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
            </div>
          )}

          {filters.length > 0 && (
            <div className="data-table__filter-wrap">
              <button
                ref={filterButtonRef}
                type="button"
                className="data-table__filter-btn"
                aria-haspopup="true"
                aria-expanded={isFilterMenuOpen}
                aria-controls={`${baseId}-filters`}
                onClick={(event) => {
                  setOpenActionsRowKey(null);
                  setActionsAnchor(null);
                  if (isFilterMenuOpen) {
                    setIsFilterMenuOpen(false);
                    setFilterAnchor(null);
                    return;
                  }
                  setFilterAnchor(event.currentTarget);
                  setIsFilterMenuOpen(true);
                }}
              >
                <ListFilter aria-hidden="true" />
                <span>{filtersLabel}</span>
                {activeFilterCount > 0 && (
                  <span className="data-table__filter-badge">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <DataTableMenuSurface
                open={isFilterMenuOpen}
                anchor={filterAnchor}
                align="end"
                width={320}
                theme={theme}
                id={`${baseId}-filters`}
                className="data-table__filter-menu"
                role="group"
                aria-label={filtersLabel}
                menuRef={filterMenuRef}
              >
                <div className="data-table__filter-menu-header">
                  <p className="data-table__filter-menu-title">{filtersLabel}</p>
                  {onClearFilters && (
                    <button
                      type="button"
                      className="data-table__filter-clear"
                      onClick={onClearFilters}
                    >
                      {clearFiltersLabel}
                    </button>
                  )}
                </div>

                {filters.map((filter) => {
                  const isOpen = openAccordionId === filter.id;
                  const panelId = `${baseId}-filter-${filter.id}`;
                  const isMultiple = filter.multiple !== false;
                  const FilterIcon = filter.icon;
                  return (
                    <div key={filter.id} className="data-table__accordion">
                      <button
                        type="button"
                        className="data-table__accordion-trigger"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() =>
                          setOpenAccordionId(isOpen ? null : filter.id)
                        }
                      >
                        <span className="data-table__accordion-label">
                          {FilterIcon && (
                            <FilterIcon
                              className="data-table__menu-icon"
                              aria-hidden="true"
                            />
                          )}
                          <span>{filter.label}</span>
                        </span>
                        <ChevronDown
                          className="data-table__accordion-chevron"
                          aria-hidden="true"
                        />
                      </button>
                      <div
                        id={panelId}
                        className="data-table__accordion-panel"
                        data-open={isOpen}
                        role="region"
                        aria-label={filter.label}
                      >
                        {filter.options.map((option) => {
                          const current = filterValues[filter.id];
                          const isChecked = isMultiple
                            ? Array.isArray(current) &&
                              current.includes(option.value)
                            : current === option.value;
                          const OptionIcon = option.icon;
                          return (
                            <label
                              key={option.value}
                              className="data-table__filter-option"
                            >
                              <input
                                className="data-table__checkbox"
                                type="checkbox"
                                name={`${baseId}-${filter.id}`}
                                checked={isChecked}
                                onChange={() =>
                                  handleFilterOptionChange(
                                    filter.id,
                                    option.value,
                                    isMultiple,
                                  )
                                }
                              />
                              {OptionIcon && (
                                <OptionIcon
                                  className="data-table__menu-icon"
                                  aria-hidden="true"
                                />
                              )}
                              <span>{option.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </DataTableMenuSurface>
            </div>
          )}
        </div>
      )}

      <div className="data-table__panel">
        {statusTabs.length > 0 && (
          <div
            className="data-table__tabs"
            role="tablist"
            aria-label={statusTabsLabel}
          >
            {statusTabs.map((tab, tabIndex) => {
              const isSelected = tab.id === activeStatusTab;
              const tone = tab.tone ?? 'neutral';
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={[
                    'data-table__tab',
                    `data-table__tab--${tone}`,
                    isSelected ? 'data-table__tab--active' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  role="tab"
                  data-status-tab={tab.id}
                  data-tone={tone}
                  aria-selected={isSelected}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => onStatusTabChange?.(tab.id)}
                  onKeyDown={(event) => handleStatusTabKeyDown(event, tabIndex)}
                >
                  <span className="data-table__tab-dot" aria-hidden="true" />
                  <span>{tab.label}</span>
                  {typeof tab.count === 'number' && (
                    <span className="data-table__tab-count">{tab.count}</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        <div className="data-table__scroll">
          <table className="data-table__grid">
            <thead>
              <tr>
                {selectable && (
                  <th className="data-table__cell--check" scope="col">
                    <input
                      className="data-table__checkbox"
                      type="checkbox"
                      checked={isAllPageSelected}
                      ref={(element) => {
                        if (element) {
                          element.indeterminate = isSomePageSelected;
                        }
                      }}
                      aria-label="Select all rows on this page"
                      onChange={handleToggleAll}
                      disabled={pageKeys.length === 0 || loading}
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    style={column.width ? { width: column.width } : undefined}
                    className={
                      column.align ? `data-table__cell--${column.align}` : undefined
                    }
                  >
                    {column.header}
                  </th>
                ))}
                {actions.length > 0 && (
                  <th className="data-table__cell--actions" scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={colSpan}>
                    <div className="data-table__loading" role="status">
                      {loadingLabel}
                    </div>
                  </td>
                </tr>
              )}

              {!loading && data.length === 0 && (
                <tr>
                  <td colSpan={colSpan}>
                    <div className="data-table__empty">{emptyMessage}</div>
                  </td>
                </tr>
              )}

              {!loading &&
                data.map((item) => {
                  const key = rowKey(item);
                  const isSelected = selectedSet.has(key);
                  const isActionsOpen = openActionsRowKey === key;
                  const rowHref = getRowHref?.(item);
                  return (
                    <tr
                      key={key}
                      data-selected={isSelected}
                      data-clickable={Boolean(rowHref)}
                      className={rowHref ? 'data-table__row--link' : undefined}
                      tabIndex={rowHref ? 0 : undefined}
                      onClick={(event) => handleRowNavigate(event, item)}
                      onKeyDown={(event) => {
                        if (!rowHref) return;
                        if (event.key !== 'Enter' && event.key !== ' ') return;
                        event.preventDefault();
                        handleRowNavigate(event, item);
                      }}
                    >
                      {selectable && (
                        <td className="data-table__cell--check">
                          <input
                            className="data-table__checkbox"
                            type="checkbox"
                            checked={isSelected}
                            aria-label={`Select row ${key}`}
                            onChange={() => handleToggleRow(key)}
                          />
                        </td>
                      )}
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className={
                            column.align
                              ? `data-table__cell--${column.align}`
                              : undefined
                          }
                        >
                          {column.render(item)}
                        </td>
                      ))}
                      {actions.length > 0 && (
                        <td className="data-table__cell--actions">
                          <div className="data-table__actions-wrap">
                            <button
                              type="button"
                              className="data-table__actions-btn"
                              aria-label={
                                getActionsAriaLabel?.(item) ??
                                `${actionsAriaLabel} ${key}`
                              }
                              aria-haspopup="true"
                              aria-expanded={isActionsOpen}
                              aria-controls={`${baseId}-actions-${key}`}
                              onClick={(event) => {
                                setIsFilterMenuOpen(false);
                                setFilterAnchor(null);
                                if (isActionsOpen) {
                                  setOpenActionsRowKey(null);
                                  setActionsAnchor(null);
                                  return;
                                }
                                setActionsAnchor(event.currentTarget);
                                setOpenActionsRowKey(key);
                              }}
                            >
                              <EllipsisVertical aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        <DataTableMenuSurface
          open={Boolean(openActionsRowKey && actionsAnchor)}
          anchor={actionsAnchor}
          align="end"
          width={180}
          theme={theme}
          id={
            openActionsRowKey
              ? `${baseId}-actions-${openActionsRowKey}`
              : undefined
          }
          className="data-table__actions-menu"
          menuRef={actionsMenuRef}
        >
          {actions.map((action) => {
            const openItem = data.find(
              (item) => rowKey(item) === openActionsRowKey,
            );
            if (!openItem) return null;
            const isDisabled = action.disabled?.(openItem) ?? false;
            const ActionIcon = action.icon;
            const actionHref = action.getHref?.(openItem);
            const itemClassName = [
              'data-table__actions-item',
              action.danger ? 'data-table__actions-item--danger' : '',
            ]
              .filter(Boolean)
              .join(' ');
            const itemContent = (
              <>
                {ActionIcon && (
                  <ActionIcon
                    className="data-table__menu-icon"
                    aria-hidden="true"
                  />
                )}
                <span>{action.label}</span>
              </>
            );
            if (actionHref && !isDisabled) {
              return (
                <Link
                  key={action.id}
                  to={actionHref}
                  className={itemClassName}
                  onClick={() => {
                    action.onClick?.(openItem);
                    closeMenus();
                  }}
                >
                  {itemContent}
                </Link>
              );
            }
            return (
              <button
                key={action.id}
                type="button"
                className={itemClassName}
                disabled={isDisabled}
                onClick={() => {
                  action.onClick?.(openItem);
                  closeMenus();
                }}
              >
                {itemContent}
              </button>
            );
          })}
        </DataTableMenuSurface>

        {showPaginationFooter && (
          <div className="data-table__footer">
            <div className="data-table__footer-meta">
              <span>{rangeLabel(rangeStart, rangeEnd, total)}</span>
              <label>
                {rowsPerPageLabel}{' '}
                <select
                  className="data-table__rows-select"
                  value={rowsPerPage}
                  aria-label={rowsPerPageLabel}
                  onChange={handleRowsPerPageChange}
                >
                  {rowsPerPageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              {selectable && selectedKeys.length > 0 && (
                <span>{selectedCountLabel(selectedKeys.length)}</span>
              )}
            </div>

            <div className="data-table__pager" role="navigation" aria-label="Pagination">
              <button
                type="button"
                className="data-table__pager-btn"
                aria-label={previousPageLabel}
                disabled={safePage <= 0}
                onClick={() => onPageChange(safePage - 1)}
              >
                {previousPageLabel}
              </button>
              {pageList.map((entry, index) =>
                entry === 'gap' ? (
                  <span key={`gap-${index}`} className="data-table__pager-info">
                    …
                  </span>
                ) : (
                  <button
                    key={entry}
                    type="button"
                    className="data-table__pager-btn"
                    aria-label={`Page ${entry + 1}`}
                    aria-current={entry === safePage ? 'page' : undefined}
                    onClick={() => onPageChange(entry)}
                  >
                    {entry + 1}
                  </button>
                ),
              )}
              <button
                type="button"
                className="data-table__pager-btn"
                aria-label={nextPageLabel}
                disabled={safePage >= pageCount - 1}
                onClick={() => onPageChange(safePage + 1)}
              >
                {nextPageLabel}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DataTable;

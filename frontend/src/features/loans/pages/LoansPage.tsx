import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Pencil, Trash2, CalendarClock, Percent } from 'lucide-react';
import { Alert, Box, Button, Stack } from '@mui/material';

import {
  DataTable,
  DataTableStatusChip,
  type DataTableAction,
  type DataTableColumn,
  type DataTableFilter,
  type DataTableFilterValues,
  type DataTableStatusTab,
  type DataTableTone,
} from '@/shared/components/DataTable';
import { PageHeader } from '@/shared/components/layouts/PageHeader';

import { loansService } from '../services/loans.service';
import type {
  GetLoansParams,
  Loan,
  LoanFrequency,
  LoanInterestType,
  LoanStatus,
} from '../types/loans.types';

const STATUS_OPTIONS: LoanStatus[] = ['ACTIVE', 'PAID', 'OVERDUE', 'CANCELLED'];

const STATUS_TONE: Record<LoanStatus, DataTableTone> = {
  ACTIVE: 'brand',
  PAID: 'success',
  OVERDUE: 'danger',
  CANCELLED: 'neutral',
};

const FREQUENCY_OPTIONS: LoanFrequency[] = [
  'DAILY',
  'WEEKLY',
  'BIWEEKLY',
  'MONTHLY',
];

const INTEREST_TYPE_OPTIONS: LoanInterestType[] = ['FIXED', 'PERIODIC'];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('es-CO');

/**
 * Loans list page using the shared DataTable surface.
 */
export default function LoansPage() {
  const { t } = useTranslation('loans/list');
  const navigate = useNavigate();

  const [loans, setLoans] = useState<Loan[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const [status, setStatus] = useState<LoanStatus | ''>('');
  const [frequency, setFrequency] = useState<LoanFrequency | ''>('');
  const [interestType, setInterestType] = useState<LoanInterestType | ''>('');
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deletingLoanId, setDeletingLoanId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const loadLoans = useCallback(async () => {
    const params: GetLoansParams = {
      page,
      limit: rowsPerPage,
      search: search || undefined,
      status: status || undefined,
      frequency: frequency || undefined,
      interestType: interestType || undefined,
      sortBy: 'createdAt',
      order: 'desc',
    };

    try {
      setLoading(true);
      setError('');
      const response = await loansService.getLoans(params);
      setLoans(response.data);
      setTotal(response.meta.total);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : t('errors.load');
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search, status, frequency, interestType, t]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setSearch(searchInput.trim());
    }, 300);
    return () => window.clearTimeout(handle);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
    setSelectedKeys([]);
  }, [search]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const params: GetLoansParams = {
        page,
        limit: rowsPerPage,
        search: search || undefined,
        status: status || undefined,
        frequency: frequency || undefined,
        interestType: interestType || undefined,
        sortBy: 'createdAt',
        order: 'desc',
      };

      try {
        setLoading(true);
        setError('');
        const response = await loansService.getLoans(params);
        if (cancelled) return;
        setLoans(response.data);
        setTotal(response.meta.total);
      } catch (requestError) {
        if (cancelled) return;
        const message =
          requestError instanceof Error
            ? requestError.message
            : t('errors.load');
        setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [page, rowsPerPage, search, status, frequency, interestType, t]);

  const handleClearFilters = () => {
    setSearchInput('');
    setSearch('');
    setStatus('');
    setFrequency('');
    setInterestType('');
    setSelectedKeys([]);
    setPage(1);
  };

  const handleStatusTabChange = (tabId: string) => {
    setStatus(tabId === 'all' ? '' : (tabId as LoanStatus));
    setSelectedKeys([]);
    setPage(1);
  };

  const handleFilterChange = (filterId: string, value: string | string[]) => {
    const nextValue = Array.isArray(value) ? (value[0] ?? '') : value;
    if (filterId === 'frequency') {
      setFrequency(nextValue as LoanFrequency | '');
      setSelectedKeys([]);
      setPage(1);
      return;
    }
    if (filterId === 'interestType') {
      setInterestType(nextValue as LoanInterestType | '');
      setSelectedKeys([]);
      setPage(1);
    }
  };

  const handleDelete = useCallback(
    async (loan: Loan) => {
      const confirmed = window.confirm(
        t('confirmDelete', { amount: formatCurrency(loan.amount) }),
      );
      if (!confirmed) return;

      try {
        setDeletingLoanId(loan.id);
        setError('');
        await loansService.deleteLoan(loan.id);
        setSelectedKeys((keys) => keys.filter((key) => key !== loan.id));
        if (loans.length === 1 && page > 1) {
          setPage((currentPage) => currentPage - 1);
        } else {
          await loadLoans();
        }
      } catch (requestError) {
        const message =
          requestError instanceof Error
            ? requestError.message
            : t('errors.delete');
        setError(message);
      } finally {
        setDeletingLoanId(null);
      }
    },
    [loans.length, page, loadLoans, t],
  );

  const columns = useMemo<DataTableColumn<Loan>[]>(
    () => [
      {
        key: 'borrowerId',
        header: t('columns.borrower'),
        render: (loan) => loan.borrowerId,
      },
      {
        key: 'loanId',
        header: t('columns.loanId'),
        render: (loan) => loan.id,
      },
      {
        key: 'amount',
        header: t('columns.amount'),
        align: 'right',
        render: (loan) => formatCurrency(loan.amount),
      },
      {
        key: 'interest',
        header: t('columns.interest'),
        render: (loan) =>
          `${loan.interestRate}% (${t(`interestType.${loan.interestType}`)})`,
      },
      {
        key: 'installment',
        header: t('columns.installment'),
        align: 'right',
        render: (loan) => formatCurrency(loan.installmentAmount),
      },
      {
        key: 'installments',
        header: t('columns.installments'),
        render: (loan) =>
          `${loan.paidInstallments}/${loan.numberOfInstallments}`,
      },
      {
        key: 'frequency',
        header: t('columns.frequency'),
        render: (loan) => t(`frequency.${loan.frequency}`),
      },
      {
        key: 'status',
        header: t('columns.status'),
        render: (loan) => (
          <DataTableStatusChip
            label={t(`status.${loan.status}`)}
            tone={STATUS_TONE[loan.status]}
          />
        ),
      },
      {
        key: 'dueDate',
        header: t('columns.dueDate'),
        render: (loan) => formatDate(loan.dueDate),
      },
    ],
    [t],
  );

  const actions = useMemo<DataTableAction<Loan>[]>(
    () => [
      {
        id: 'view',
        label: t('actions.view'),
        icon: Eye,
        getHref: (loan) => `/loans/${loan.id}`,
      },
      {
        id: 'edit',
        label: t('actions.edit'),
        icon: Pencil,
        getHref: (loan) => `/loans/${loan.id}/edit`,
      },
      {
        id: 'delete',
        label: t('actions.delete'),
        icon: Trash2,
        danger: true,
        disabled: (loan) => deletingLoanId === loan.id,
        onClick: (loan) => {
          void handleDelete(loan);
        },
      },
    ],
    [deletingLoanId, handleDelete, t],
  );

  const filters = useMemo<DataTableFilter[]>(
    () => [
      {
        id: 'frequency',
        label: t('filters.frequency'),
        icon: CalendarClock,
        multiple: false,
        options: FREQUENCY_OPTIONS.map((option) => ({
          value: option,
          label: t(`frequency.${option}`),
        })),
      },
      {
        id: 'interestType',
        label: t('filters.interestType'),
        icon: Percent,
        multiple: false,
        options: INTEREST_TYPE_OPTIONS.map((option) => ({
          value: option,
          label: t(`interestType.${option}`),
        })),
      },
    ],
    [t],
  );

  const filterValues = useMemo<DataTableFilterValues>(
    () => ({
      frequency,
      interestType,
    }),
    [frequency, interestType],
  );

  const statusTabs = useMemo<DataTableStatusTab[]>(
    () => [
      { id: 'all', label: t('tabs.all'), tone: 'neutral' },
      ...STATUS_OPTIONS.map((option) => ({
        id: option,
        label: t(`status.${option}`),
        tone: STATUS_TONE[option],
      })),
    ],
    [t],
  );

  return (
    <Box
      sx={{
        p: 0,
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        alignSelf: 'stretch',
        boxSizing: 'border-box',
      }}
    >
      <Stack spacing={3}>
        <PageHeader
          title={t('title')}
          description={t('subtitle')}
          actions={
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              startIcon={<Plus size={18} strokeWidth={2.25} aria-hidden />}
              onClick={() => navigate('/loans/new')}
            >
              {t('createLoan')}
            </Button>
          }
        />

        {error && <Alert severity="error">{error}</Alert>}

        <DataTable
          columns={columns}
          data={loans}
          rowKey={(loan) => loan.id}
          loading={loading}
          emptyMessage={t('empty')}
          searchValue={searchInput}
          searchPlaceholder={t('searchPlaceholder')}
          onSearchChange={setSearchInput}
          filters={filters}
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          filtersLabel={t('filters.label')}
          clearFiltersLabel={t('filters.clear')}
          statusTabs={statusTabs}
          activeStatusTab={status || 'all'}
          onStatusTabChange={handleStatusTabChange}
          selectable
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          actions={actions}
          actionsAriaLabel={t('actions.menu')}
          getActionsAriaLabel={(loan) =>
            t('actions.menuFor', { id: loan.id })
          }
          getRowHref={(loan) => `/loans/${loan.id}`}
          page={page - 1}
          rowsPerPage={rowsPerPage}
          total={total}
          onPageChange={(nextPage) => {
            setPage(nextPage + 1);
          }}
          onRowsPerPageChange={(nextRowsPerPage) => {
            setRowsPerPage(nextRowsPerPage);
            setPage(1);
          }}
          previousPageLabel={t('pagination.prev')}
          nextPageLabel={t('pagination.next')}
          rowsPerPageLabel={t('pagination.rows')}
          rangeLabel={(start, end, totalCount) =>
            t('pagination.range', { start, end, total: totalCount })
          }
          selectedCountLabel={(count) =>
            t('pagination.selected', { count })
          }
          loadingLabel={t('loading')}
          regionLabel={t('title')}
          statusTabsLabel={t('filters.status')}
        />
      </Stack>
    </Box>
  );
}

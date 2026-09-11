import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import TableComponent from '../../../shared/components/TableComponent';
import { loansService } from '../services/loans.service';
import type {
  GetLoansParams,
  Loan,
  LoanFrequency,
  LoanInterestType,
  LoanStatus,
} from '../types/loans.types';

const STATUS_OPTIONS: LoanStatus[] = ['ACTIVE', 'PAID', 'OVERDUE', 'CANCELLED'];

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

const formatStatus = (value: LoanStatus) =>
  value
    .replace('_', ' ')
    .toLowerCase()
    .replace(/^\w/, (character) => character.toUpperCase());

const formatFrequency = (value: LoanFrequency) =>
  value
    .replace('_', ' ')
    .toLowerCase()
    .replace(/^\w/, (character) => character.toUpperCase());

const formatInterestType = (value: LoanInterestType) =>
  value
    .replace('_', ' ')
    .toLowerCase()
    .replace(/^\w/, (character) => character.toUpperCase());

export default function LoansPage() {
  const navigate = useNavigate();

  const [loans, setLoans] = useState<Loan[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const [status, setStatus] = useState<LoanStatus | ''>('');
  const [frequency, setFrequency] = useState<LoanFrequency | ''>('');
  const [interestType, setInterestType] = useState<LoanInterestType | ''>('');

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
          : 'Unable to load loans';

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search, status, frequency, interestType]);

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

        if (cancelled) {
          return;
        }

        setLoans(response.data);
        setTotal(response.meta.total);
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        const message =
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load loans';

        setError(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [page, rowsPerPage, search, status, frequency, interestType]);

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSearch('');
    setStatus('');
    setFrequency('');
    setInterestType('');
    setPage(1);
  };

  const handleDelete = useCallback(
    async (loan: Loan) => {
      const confirmed = window.confirm(
        `Are you sure you want to delete this loan of ${formatCurrency(
          loan.amount,
        )}?`,
      );

      if (!confirmed) {
        return;
      }

      try {
        setDeletingLoanId(loan.id);
        setError('');

        await loansService.deleteLoan(loan.id);

        if (loans.length === 1 && page > 1) {
          setPage((currentPage) => currentPage - 1);
        } else {
          await loadLoans();
        }
      } catch (requestError) {
        const message =
          requestError instanceof Error
            ? requestError.message
            : 'Unable to delete loan';

        setError(message);
      } finally {
        setDeletingLoanId(null);
      }
    },
    [loans.length, page, loadLoans],
  );

  const columns = useMemo(
    () => [
      {
        key: 'borrowerId',
        header: 'Borrower',
        render: (loan: Loan) => loan.borrowerId,
      },
      {
        key: 'loanId',
        header: 'Loan ID',
        render: (loan: Loan) => loan.id,
      },
      {
        key: 'amount',
        header: 'Amount',
        render: (loan: Loan) => formatCurrency(loan.amount),
      },
      {
        key: 'interest',
        header: 'Interest',
        render: (loan: Loan) =>
          `${loan.interestRate}% (${formatInterestType(loan.interestType)})`,
      },
      {
        key: 'installment',
        header: 'Installment',
        render: (loan: Loan) => formatCurrency(loan.installmentAmount),
      },
      {
        key: 'installments',
        header: 'Installments',
        render: (loan: Loan) =>
          `${loan.paidInstallments}/${loan.numberOfInstallments}`,
      },
      {
        key: 'frequency',
        header: 'Frequency',
        render: (loan: Loan) => formatFrequency(loan.frequency),
      },
      {
        key: 'status',
        header: 'Status',
        render: (loan: Loan) => formatStatus(loan.status),
      },
      {
        key: 'dueDate',
        header: 'Due Date',
        render: (loan: Loan) => formatDate(loan.dueDate),
      },
      {
        key: 'actions',
        header: 'Actions',
        render: (loan: Loan) => (
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => navigate(`/loans/${loan.id}`)}
            >
              View
            </Button>

            <Button
              size="small"
              variant="outlined"
              onClick={() => navigate(`/loans/${loan.id}/edit`)}
            >
              Edit
            </Button>

            <Button
              size="small"
              variant="outlined"
              color="error"
              disabled={deletingLoanId === loan.id}
              onClick={() => void handleDelete(loan)}
            >
              {deletingLoanId === loan.id ? 'Deleting...' : 'Delete'}
            </Button>
          </Stack>
        ),
      },
    ],
    [deletingLoanId, navigate, handleDelete],
  );

  return (
    <Box sx={{ p: 4 }}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            justifyContent: {
              xs: 'flex-start',
              sm: 'space-between',
            },
            alignItems: {
              xs: 'flex-start',
              sm: 'center',
            },
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Loans
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Manage your loans and repayment schedules.
            </Typography>
          </Box>

          <Button variant="contained" onClick={() => navigate('/loans/new')}>
            Create Loan
          </Button>
        </Stack>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{
            alignItems: {
              xs: 'stretch',
              md: 'center',
            },
          }}
        >
          <TextField
            label="Search loans"
            placeholder="Search by borrower name, email or Loan ID"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleSearch();
              }
            }}
            size="small"
            fullWidth
          />

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Status</InputLabel>

            <Select
              value={status}
              label="Status"
              onChange={(event) => {
                setStatus(event.target.value as LoanStatus | '');
                setPage(1);
              }}
            >
              <MenuItem value="">All</MenuItem>

              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {formatStatus(option)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Frequency</InputLabel>

            <Select
              value={frequency}
              label="Frequency"
              onChange={(event) => {
                setFrequency(event.target.value as LoanFrequency | '');
                setPage(1);
              }}
            >
              <MenuItem value="">All</MenuItem>

              {FREQUENCY_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {formatFrequency(option)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Interest Type</InputLabel>

            <Select
              value={interestType}
              label="Interest Type"
              onChange={(event) => {
                setInterestType(event.target.value as LoanInterestType | '');
                setPage(1);
              }}
            >
              <MenuItem value="">All</MenuItem>

              {INTEREST_TYPE_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {formatInterestType(option)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="contained" onClick={handleSearch} disabled={loading}>
            Search
          </Button>

          <Button
            variant="outlined"
            onClick={handleClearFilters}
            disabled={
              !searchInput && !search && !status && !frequency && !interestType
            }
          >
            Clear
          </Button>
        </Stack>

        {error && <Alert severity="error">{error}</Alert>}

        {loading && loans.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              py: 8,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <TableComponent
            columns={columns}
            data={loans}
            rowKey={(loan) => loan.id}
            loading={loading}
            emptyMessage="No loans found"
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
          />
        )}
      </Stack>
    </Box>
  );
}

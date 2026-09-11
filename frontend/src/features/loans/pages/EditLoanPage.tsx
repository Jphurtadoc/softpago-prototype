import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { loansService } from '../services/loans.service';
import type {
  LoanFrequency,
  LoanInterestType,
  LoanStatus,
  UpdateLoanRequest,
} from '../types/loans.types';

const FREQUENCY_OPTIONS: LoanFrequency[] = [
  'DAILY',
  'WEEKLY',
  'BIWEEKLY',
  'MONTHLY',
];

const INTEREST_TYPE_OPTIONS: LoanInterestType[] = ['FIXED', 'PERIODIC'];

const STATUS_OPTIONS: LoanStatus[] = ['ACTIVE', 'PAID', 'OVERDUE', 'CANCELLED'];

const formatOption = (value: string) =>
  value
    .replace('_', ' ')
    .toLowerCase()
    .replace(/^\w/, (character) => character.toUpperCase());

export default function EditLoanPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [borrowerId, setBorrowerId] = useState('');
  const [routeId, setRouteId] = useState('');
  const [debtCollectorId, setDebtCollectorId] = useState('');

  const [amount, setAmount] = useState('');
  const [interestType, setInterestType] = useState<LoanInterestType>('FIXED');
  const [interestRate, setInterestRate] = useState('');

  const [totalAmount, setTotalAmount] = useState('');
  const [installmentAmount, setInstallmentAmount] = useState('');

  const [numberOfInstallments, setNumberOfInstallments] = useState('');
  const [paidInstallments, setPaidInstallments] = useState('0');

  const [frequency, setFrequency] = useState<LoanFrequency>('MONTHLY');

  const [status, setStatus] = useState<LoanStatus>('ACTIVE');

  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');

  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      return;
    }

    const loadLoan = async () => {
      try {
        setLoading(true);
        setError('');

        const loan = await loansService.getLoanById(id);

        setBorrowerId(loan.borrowerId);
        setRouteId(loan.routeId ?? '');
        setDebtCollectorId(loan.debtCollectorId ?? '');

        setAmount(String(loan.amount));
        setInterestType(loan.interestType);
        setInterestRate(String(loan.interestRate));

        setTotalAmount(String(loan.totalAmount));
        setInstallmentAmount(String(loan.installmentAmount));

        setNumberOfInstallments(String(loan.numberOfInstallments));
        setPaidInstallments(String(loan.paidInstallments));

        setFrequency(loan.frequency);
        setStatus(loan.status);

        setStartDate(loan.startDate.slice(0, 10));
        setDueDate(loan.dueDate.slice(0, 10));
      } catch (requestError) {
        const message =
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load loan';

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void loadLoan();
  }, [id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id) {
      setError('Loan ID is missing');
      return;
    }

    if (!borrowerId.trim()) {
      setError('Borrower ID is required');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const data: UpdateLoanRequest = {
        borrowerId: borrowerId.trim(),
        routeId: routeId.trim() || undefined,
        debtCollectorId: debtCollectorId.trim() || undefined,

        amount: Number(amount),

        interestType,
        interestRate: Number(interestRate),

        totalAmount: Number(totalAmount),
        installmentAmount: Number(installmentAmount),

        numberOfInstallments: Number(numberOfInstallments),
        paidInstallments: Number(paidInstallments),

        frequency,
        status,

        startDate,
        dueDate,
      };

      await loansService.updateLoan(id, data);

      navigate(`/loans/${id}`);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : 'Unable to update loan';

      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (!id) {
    return (
      <Box sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Alert severity="error">Loan ID is missing</Alert>

          <Button variant="outlined" onClick={() => navigate('/loans')}>
            Back to Loans
          </Button>
        </Stack>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        sx={{
          p: 4,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Typography>Loading loan...</Typography>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Edit Loan
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Update the loan information and repayment schedule.
          </Typography>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            label="Borrower ID"
            value={borrowerId}
            onChange={(event) => setBorrowerId(event.target.value)}
            required
            fullWidth
            disabled={saving}
          />

          <TextField
            label="Route ID"
            value={routeId}
            onChange={(event) => setRouteId(event.target.value)}
            fullWidth
            disabled={saving}
          />

          <TextField
            label="Debt Collector ID"
            value={debtCollectorId}
            onChange={(event) => setDebtCollectorId(event.target.value)}
            fullWidth
            disabled={saving}
          />
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            required
            fullWidth
            disabled={saving}
          />

          <FormControl fullWidth disabled={saving}>
            <InputLabel>Interest Type</InputLabel>

            <Select
              value={interestType}
              label="Interest Type"
              onChange={(event) =>
                setInterestType(event.target.value as LoanInterestType)
              }
            >
              {INTEREST_TYPE_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {formatOption(option)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Interest Rate (%)"
            type="number"
            value={interestRate}
            onChange={(event) => setInterestRate(event.target.value)}
            required
            fullWidth
            disabled={saving}
          />
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            label="Total Amount"
            type="number"
            value={totalAmount}
            onChange={(event) => setTotalAmount(event.target.value)}
            required
            fullWidth
            disabled={saving}
          />

          <TextField
            label="Installment Amount"
            type="number"
            value={installmentAmount}
            onChange={(event) => setInstallmentAmount(event.target.value)}
            required
            fullWidth
            disabled={saving}
          />

          <TextField
            label="Number of Installments"
            type="number"
            value={numberOfInstallments}
            onChange={(event) => setNumberOfInstallments(event.target.value)}
            required
            fullWidth
            disabled={saving}
          />

          <TextField
            label="Paid Installments"
            type="number"
            value={paidInstallments}
            onChange={(event) => setPaidInstallments(event.target.value)}
            fullWidth
            disabled={saving}
          />
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <FormControl fullWidth disabled={saving}>
            <InputLabel>Frequency</InputLabel>

            <Select
              value={frequency}
              label="Frequency"
              onChange={(event) =>
                setFrequency(event.target.value as LoanFrequency)
              }
            >
              {FREQUENCY_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {formatOption(option)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth disabled={saving}>
            <InputLabel>Status</InputLabel>

            <Select
              value={status}
              label="Status"
              onChange={(event) => setStatus(event.target.value as LoanStatus)}
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {formatOption(option)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            required
            fullWidth
            disabled={saving}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />

          <TextField
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            required
            fullWidth
            disabled={saving}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
        </Stack>

        <Stack
          direction="row"
          spacing={2}
          sx={{
            justifyContent: 'flex-end',
          }}
        >
          <Button
            type="button"
            variant="outlined"
            onClick={() => navigate(`/loans/${id}`)}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

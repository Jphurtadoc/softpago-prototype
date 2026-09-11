import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  CreateLoanRequest,
  LoanFrequency,
  LoanInterestType,
  LoanStatus,
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

export default function CreateLoanPage() {
  const navigate = useNavigate();

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

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!borrowerId.trim()) {
      setError('Borrower ID is required');
      return;
    }

    if (!amount) {
      setError('Amount is required');
      return;
    }

    if (!interestRate) {
      setError('Interest rate is required');
      return;
    }

    if (!totalAmount) {
      setError('Total amount is required');
      return;
    }

    if (!installmentAmount) {
      setError('Installment amount is required');
      return;
    }

    if (!numberOfInstallments) {
      setError('Number of installments is required');
      return;
    }

    if (!startDate) {
      setError('Start date is required');
      return;
    }

    if (!dueDate) {
      setError('Due date is required');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const data: CreateLoanRequest = {
        borrowerId: borrowerId.trim(),
        routeId: routeId.trim() || undefined,
        debtCollectorId: debtCollectorId.trim() || undefined,

        amount: Number(amount),

        interestType,
        interestRate: Number(interestRate),

        totalAmount: Number(totalAmount),
        installmentAmount: Number(installmentAmount),

        numberOfInstallments: Number(numberOfInstallments),
        paidInstallments: Number(paidInstallments || 0),

        frequency,
        status,

        startDate,
        dueDate,
      };

      await loansService.createLoan(data);

      navigate('/loans');
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : 'Unable to create loan';

      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Create Loan
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Create a new loan and define its repayment schedule.
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
            slotProps={{
              htmlInput: {
                min: 0,
                step: '0.01',
              },
            }}
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
            slotProps={{
              htmlInput: {
                min: 0,
                step: '0.01',
              },
            }}
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
            slotProps={{
              htmlInput: {
                min: 0,
                step: '0.01',
              },
            }}
          />

          <TextField
            label="Installment Amount"
            type="number"
            value={installmentAmount}
            onChange={(event) => setInstallmentAmount(event.target.value)}
            required
            fullWidth
            disabled={saving}
            slotProps={{
              htmlInput: {
                min: 0,
                step: '0.01',
              },
            }}
          />

          <TextField
            label="Number of Installments"
            type="number"
            value={numberOfInstallments}
            onChange={(event) => setNumberOfInstallments(event.target.value)}
            required
            fullWidth
            disabled={saving}
            slotProps={{
              htmlInput: {
                min: 1,
                step: 1,
              },
            }}
          />

          <TextField
            label="Paid Installments"
            type="number"
            value={paidInstallments}
            onChange={(event) => setPaidInstallments(event.target.value)}
            fullWidth
            disabled={saving}
            slotProps={{
              htmlInput: {
                min: 0,
                step: 1,
              },
            }}
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
            onClick={() => navigate('/loans')}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? 'Creating...' : 'Create Loan'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

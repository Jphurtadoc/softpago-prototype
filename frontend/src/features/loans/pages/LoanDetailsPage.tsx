import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';

import { loansService } from '../services/loans.service';
import type {
  Loan,
  LoanFrequency,
  LoanInterestType,
  LoanStatus,
} from '../types/loans.types';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('es-CO');

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString('es-CO');

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

export default function LoanDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [loan, setLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      return;
    }

    const loadLoan = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await loansService.getLoanById(id);

        setLoan(response);
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
          display: 'flex',
          justifyContent: 'center',
          py: 8,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!loan) {
    return (
      <Box sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Alert severity="error">{error || 'Loan not found'}</Alert>

          <Button variant="outlined" onClick={() => navigate('/loans')}>
            Back to Loans
          </Button>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Stack spacing={3}>
        {error && <Alert severity="error">{error}</Alert>}

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
              Loan Details
            </Typography>

            <Typography variant="body2" color="text.secondary">
              View loan information and repayment details.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              onClick={() => navigate(`/loans/${loan.id}/edit`)}
            >
              Edit
            </Button>

            <Button variant="outlined" onClick={() => navigate('/loans')}>
              Back
            </Button>
          </Stack>
        </Stack>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                sx={{
                  alignItems: {
                    xs: 'flex-start',
                    sm: 'center',
                  },
                }}
              >
                <Typography variant="h6">Status</Typography>

                <Chip
                  label={formatStatus(loan.status)}
                  color={
                    loan.status === 'ACTIVE'
                      ? 'primary'
                      : loan.status === 'PAID'
                        ? 'success'
                        : loan.status === 'OVERDUE'
                          ? 'error'
                          : 'default'
                  }
                />
              </Stack>

              <Divider />

              <Typography variant="body2">
                <strong>Loan ID:</strong> {loan.id}
              </Typography>

              <Typography variant="body2">
                <strong>Lender ID:</strong> {loan.lenderId}
              </Typography>

              <Typography variant="body2">
                <strong>Borrower ID:</strong> {loan.borrowerId}
              </Typography>

              <Typography variant="body2">
                <strong>Route ID:</strong> {loan.routeId || 'Not assigned'}
              </Typography>

              <Typography variant="body2">
                <strong>Debt Collector ID:</strong>{' '}
                {loan.debtCollectorId || 'Not assigned'}
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">Financial Information</Typography>

              <Divider />

              <Typography variant="body2">
                <strong>Amount:</strong> {formatCurrency(loan.amount)}
              </Typography>

              <Typography variant="body2">
                <strong>Interest:</strong> {loan.interestRate}% (
                {formatInterestType(loan.interestType)})
              </Typography>

              <Typography variant="body2">
                <strong>Total Amount:</strong>{' '}
                {formatCurrency(loan.totalAmount)}
              </Typography>

              <Typography variant="body2">
                <strong>Installment Amount:</strong>{' '}
                {formatCurrency(loan.installmentAmount)}
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">Repayment Schedule</Typography>

              <Divider />

              <Typography variant="body2">
                <strong>Frequency:</strong> {formatFrequency(loan.frequency)}
              </Typography>

              <Typography variant="body2">
                <strong>Installments:</strong> {loan.paidInstallments} /{' '}
                {loan.numberOfInstallments}
              </Typography>

              <Typography variant="body2">
                <strong>Start Date:</strong> {formatDate(loan.startDate)}
              </Typography>

              <Typography variant="body2">
                <strong>Due Date:</strong> {formatDate(loan.dueDate)}
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">Record Information</Typography>

              <Divider />

              <Typography variant="body2">
                <strong>Created:</strong> {formatDateTime(loan.createdAt)}
              </Typography>

              <Typography variant="body2">
                <strong>Updated:</strong> {formatDateTime(loan.updatedAt)}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}

import { useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import type { RouteLoan } from '../../types/routes.types';
import { routesService } from '../../services/routes.service';

interface RouteLoansTableProps {
  routeId: string;
  loans: RouteLoan[];
  onChange: () => void;
}

export default function RouteLoansTable({
  routeId,
  loans,
  onChange,
}: RouteLoansTableProps) {
  const [editingLoan, setEditingLoan] = useState<RouteLoan | null>(null);

  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOpenEdit = (loan: RouteLoan) => {
    setEditingLoan(loan);
    setAmount(String(loan.amount));
    setError('');
  };

  const handleCloseEdit = () => {
    if (loading) {
      return;
    }

    setEditingLoan(null);
    setAmount('');
    setError('');
  };

  const handleUpdate = async () => {
    if (!editingLoan) {
      return;
    }

    const parsedAmount = Number(amount);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be greater than zero');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await routesService.updateLoan(routeId, editingLoan.loanId, {
        amount: parsedAmount,
      });

      handleCloseEdit();
      onChange();
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : 'Unable to update loan';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (loanId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to remove this loan from the route?',
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      await routesService.removeLoan(routeId, loanId);

      onChange();
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : 'Unable to remove loan';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (loans.length === 0) {
    return (
      <Alert severity="info">This route does not contain any loans.</Alert>
    );
  }

  return (
    <>
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}

        {loans.map((loan) => (
          <Stack
            key={loan.loanId}
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{
              alignItems: {
                xs: 'stretch',
                sm: 'center',
              },
              justifyContent: {
                xs: 'flex-start',
                sm: 'space-between',
              },
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              p: 2,
            }}
          >
            <Stack spacing={0.5}>
              <Typography variant="subtitle1">{loan.borrowerName}</Typography>

              <Typography variant="body2" color="text.secondary">
                Loan ID: {loan.loanId}
              </Typography>

              <Typography variant="body2">
                Amount: ${loan.amount.toLocaleString()}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleOpenEdit(loan)}
                disabled={loading}
              >
                Edit
              </Button>

              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleRemove(loan.loanId)}
                disabled={loading}
              >
                Remove
              </Button>
            </Stack>
          </Stack>
        ))}
      </Stack>

      <Dialog
        open={Boolean(editingLoan)}
        onClose={handleCloseEdit}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Loan</DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Amount"
              type="number"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              fullWidth
              disabled={loading}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseEdit} disabled={loading}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={() => void handleUpdate()}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

import { useEffect, useState } from 'react';
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
} from '@mui/material';

import { loansService } from '../../services/loans.service';
import { routesService } from '../../services/routes.service';

import type { Loan } from '../../types/routes.types';

interface AddRouteLoanFormProps {
  routeId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddRouteLoanForm({
  routeId,
  onSuccess,
  onCancel,
}: AddRouteLoanFormProps) {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [selectedLoanId, setSelectedLoanId] = useState('');

  const [loadingLoans, setLoadingLoans] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadLoans = async () => {
      try {
        setLoadingLoans(true);
        setError('');

        const response = await loansService.getAvailableLoans();

        const availableLoans = response.data.filter((loan) => !loan.routeId);

        setLoans(availableLoans);
      } catch (requestError) {
        const message =
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load loans';

        setError(message);
      } finally {
        setLoadingLoans(false);
      }
    };

    void loadLoans();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedLoanId) {
      setError('Select a loan');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await routesService.addLoan(routeId, {
        loanId: selectedLoanId,
      });

      onSuccess();
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : 'Unable to add loan';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}

        {loadingLoans ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              py: 3,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <FormControl fullWidth required>
            <InputLabel id="route-loan-select-label">Loan</InputLabel>

            <Select
              labelId="route-loan-select-label"
              value={selectedLoanId}
              label="Loan"
              onChange={(event) => setSelectedLoanId(event.target.value)}
              disabled={loading}
            >
              {loans.length === 0 ? (
                <MenuItem disabled value="">
                  No available loans
                </MenuItem>
              ) : (
                loans.map((loan) => (
                  <MenuItem key={loan.id} value={loan.id}>
                    {loan.id} - ${loan.amount.toLocaleString()}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        )}

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
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={loading || loadingLoans || loans.length === 0}
          >
            {loading ? 'Adding...' : 'Add Loan'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

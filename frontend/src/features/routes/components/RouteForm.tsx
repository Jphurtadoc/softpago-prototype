import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { debtCollectorsService } from '../../debt-collectors/services/debt-collectors.service';
import type { DebtCollector } from '../../debt-collectors/types/debt-collectors.types';

import { routesService } from '../services/routes.service';
import type { CreateRouteRequest } from '../types/routes.types';

interface RouteFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface JwtPayload {
  sub: string;
  role: string;
  lenderId?: string;
}

function getCurrentUser(): JwtPayload | null {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    return null;
  }

  try {
    const payload = token.split('.')[1];

    if (!payload) {
      return null;
    }

    return JSON.parse(atob(payload)) as JwtPayload;
  } catch {
    return null;
  }
}

export default function RouteForm({ onSuccess, onCancel }: RouteFormProps) {
  const currentUser = getCurrentUser();

  const isRoot = currentUser?.role === 'ROOT';

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [lenderId, setLenderId] = useState(currentUser?.lenderId ?? '');

  const [debtCollectors, setDebtCollectors] = useState<DebtCollector[]>([]);
  const [selectedDebtCollectors, setSelectedDebtCollectors] = useState<
    string[]
  >([]);

  const [loadingDebtCollectors, setLoadingDebtCollectors] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDebtCollectors = async () => {
      try {
        setLoadingDebtCollectors(true);
        setError('');

        const collectors = await debtCollectorsService.getAllDebtCollectors();

        setDebtCollectors(collectors);
      } catch (requestError) {
        const message =
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load debt collectors';

        setError(message);
      } finally {
        setLoadingDebtCollectors(false);
      }
    };

    void loadDebtCollectors();
  }, []);

  const handleDebtCollectorChange = (id: string) => {
    setSelectedDebtCollectors((current) => {
      if (current.includes(id)) {
        return current.filter((collectorId) => collectorId !== id);
      }

      return [...current, id];
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      setError('Route name is required');
      return;
    }

    if (isRoot && !lenderId.trim()) {
      setError('Lender ID is required for ROOT users');
      return;
    }

    if (selectedDebtCollectors.length === 0) {
      setError('Select at least one debt collector');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const data: CreateRouteRequest = {
        name: name.trim(),
        description: description.trim() || undefined,
        debtCollectors: selectedDebtCollectors,
        ...(isRoot ? { lenderId: lenderId.trim() } : {}),
      };

      await routesService.createRoute(data);

      onSuccess();
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : 'Unable to create route';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Create Route
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Create a new loan portfolio and assign debt collectors.
          </Typography>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Route name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          fullWidth
          disabled={loading}
        />

        <TextField
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          multiline
          minRows={3}
          fullWidth
          disabled={loading}
        />

        {isRoot && (
          <TextField
            label="Lender ID"
            value={lenderId}
            onChange={(event) => setLenderId(event.target.value)}
            required
            fullWidth
            disabled={loading}
            helperText="Required when creating a route as ROOT."
          />
        )}

        <FormControl component="fieldset">
          <FormLabel component="legend">Debt Collectors</FormLabel>

          {loadingDebtCollectors ? (
            <Box sx={{ display: 'flex', py: 3 }}>
              <CircularProgress size={24} />
            </Box>
          ) : debtCollectors.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              No debt collectors available.
            </Alert>
          ) : (
            <FormGroup sx={{ mt: 1 }}>
              {debtCollectors.map((collector) => (
                <FormControlLabel
                  key={collector.id}
                  control={
                    <Checkbox
                      checked={selectedDebtCollectors.includes(collector.id)}
                      onChange={() => handleDebtCollectorChange(collector.id)}
                      disabled={loading}
                    />
                  }
                  label={`${collector.name} (${collector.email})`}
                />
              ))}
            </FormGroup>
          )}
        </FormControl>

        <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
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
            disabled={loading || loadingDebtCollectors}
          >
            {loading ? 'Creating...' : 'Create Route'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

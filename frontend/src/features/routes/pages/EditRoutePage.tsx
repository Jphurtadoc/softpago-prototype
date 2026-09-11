import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import type { Route, UpdateRouteRequest } from '../types/routes.types';

export default function EditRoutePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [route, setRoute] = useState<Route | null>(null);
  const [debtCollectors, setDebtCollectors] = useState<DebtCollector[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDebtCollectors, setSelectedDebtCollectors] = useState<
    string[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        const [routeResponse, collectorsResponse] = await Promise.all([
          routesService.getRouteById(id),
          debtCollectorsService.getAllDebtCollectors(),
        ]);

        setRoute(routeResponse);
        setDebtCollectors(collectorsResponse);
        setName(routeResponse.name);
        setDescription(routeResponse.description ?? '');
        setSelectedDebtCollectors(routeResponse.debtCollectors);
      } catch (requestError) {
        const message =
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load route';

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [id]);

  const handleDebtCollectorChange = (collectorId: string) => {
    setSelectedDebtCollectors((current) => {
      if (current.includes(collectorId)) {
        return current.filter((id) => id !== collectorId);
      }

      return [...current, collectorId];
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id) {
      setError('Route ID is missing');
      return;
    }

    if (!name.trim()) {
      setError('Route name is required');
      return;
    }

    if (selectedDebtCollectors.length === 0) {
      setError('Select at least one debt collector');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const data: UpdateRouteRequest = {
        name: name.trim(),
        description: description.trim() || undefined,
        debtCollectors: selectedDebtCollectors,
      };

      await routesService.updateRoute(id, data);

      navigate('/routes');
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : 'Unable to update route';

      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (!id) {
    return (
      <Box sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Alert severity="error">Route ID is missing</Alert>

          <Button variant="outlined" onClick={() => navigate('/routes')}>
            Back to Routes
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

  if (!route) {
    return (
      <Box sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Alert severity="error">{error || 'Route not found'}</Alert>

          <Button variant="outlined" onClick={() => navigate('/routes')}>
            Back to Routes
          </Button>
        </Stack>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Edit Route
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Update the route information and assigned debt collectors.
          </Typography>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Route name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          fullWidth
          disabled={saving}
        />

        <TextField
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          multiline
          minRows={3}
          fullWidth
          disabled={saving}
        />

        <FormControl component="fieldset">
          <FormLabel component="legend">Debt Collectors</FormLabel>

          {debtCollectors.length === 0 ? (
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
                      disabled={saving}
                    />
                  }
                  label={`${collector.name} (${collector.email})`}
                />
              ))}
            </FormGroup>
          )}
        </FormControl>

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
            onClick={() => navigate('/routes')}
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

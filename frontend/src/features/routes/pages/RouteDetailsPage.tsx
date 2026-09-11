import { useCallback, useEffect, useState } from 'react';
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

import AddRouteLoanForm from '../components/loans/AddRouteLoanForm';
import RouteLoansTable from '../components/loans/RouteLoansTable';

import { debtCollectorsService } from '../../debt-collectors/services/debt-collectors.service';
import type { DebtCollector } from '../../debt-collectors/types/debt-collectors.types';

import { routesService } from '../services/routes.service';
import type { Route } from '../types/routes.types';

export default function RouteDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [route, setRoute] = useState<Route | null>(null);
  const [debtCollectors, setDebtCollectors] = useState<DebtCollector[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddLoan, setShowAddLoan] = useState(false);
  const [error, setError] = useState('');

  const loadRouteData = useCallback(async () => {
    if (!id) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      const [routeResponse, debtCollectorsResponse] = await Promise.all([
        routesService.getRouteById(id),
        debtCollectorsService.getAllDebtCollectors(),
      ]);

      setRoute(routeResponse);
      setDebtCollectors(debtCollectorsResponse);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : 'Unable to load route';

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      return;
    }

    const loadData = async () => {
      await loadRouteData();
    };

    void loadData();
  }, [id, loadRouteData]);

  const assignedDebtCollectors = debtCollectors.filter((collector) =>
    route?.debtCollectors.includes(collector.id),
  );

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
              {route.name}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {route.description || 'No description'}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              onClick={() => navigate(`/routes/${route.id}/edit`)}
            >
              Edit
            </Button>

            <Button variant="outlined" onClick={() => navigate('/routes')}>
              Back
            </Button>
          </Stack>
        </Stack>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">Route Information</Typography>

              <Divider />

              <Typography variant="body2">
                <strong>Route ID:</strong> {route.id}
              </Typography>

              <Typography variant="body2">
                <strong>Lender ID:</strong> {route.lenderId}
              </Typography>

              <Typography variant="body2">
                <strong>Loans:</strong> {route.loanCount}
              </Typography>

              <Typography variant="body2">
                <strong>Created:</strong>{' '}
                {new Date(route.createdAt).toLocaleString()}
              </Typography>

              <Typography variant="body2">
                <strong>Updated:</strong>{' '}
                {new Date(route.updatedAt).toLocaleString()}
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">Debt Collectors</Typography>

              <Divider />

              {assignedDebtCollectors.length === 0 ? (
                <Alert severity="info">
                  No debt collectors assigned to this route.
                </Alert>
              ) : (
                <Stack spacing={1}>
                  {assignedDebtCollectors.map((collector) => (
                    <Stack
                      key={collector.id}
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={1}
                      sx={{
                        alignItems: {
                          xs: 'flex-start',
                          sm: 'center',
                        },
                      }}
                    >
                      <Chip label={collector.name} />

                      <Typography variant="body2" color="text.secondary">
                        {collector.email}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              )}
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={2}>
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
                  <Typography variant="h6">Loans</Typography>

                  <Typography variant="body2" color="text.secondary">
                    Loans assigned to this route.
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  onClick={() => setShowAddLoan(true)}
                >
                  Add Loan
                </Button>
              </Stack>

              <Divider />

              {showAddLoan ? (
                <AddRouteLoanForm
                  routeId={route.id}
                  onSuccess={async () => {
                    setShowAddLoan(false);
                    await loadRouteData();
                  }}
                  onCancel={() => setShowAddLoan(false)}
                />
              ) : null}

              <RouteLoansTable
                routeId={route.id}
                loans={route.loans}
                onChange={() => {
                  void loadRouteData();
                }}
              />
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}

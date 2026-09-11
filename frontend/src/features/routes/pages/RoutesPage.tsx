import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import TableComponent from '../../../shared/components/TableComponent';
import { routesService } from '../services/routes.service';
import type { GetRoutesParams, Route } from '../types/routes.types';

export default function RoutesPage() {
  const navigate = useNavigate();

  const [routes, setRoutes] = useState<Route[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deletingRouteId, setDeletingRouteId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const loadRoutes = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const params: GetRoutesParams = {
        page,
        limit: rowsPerPage,
        search: search || undefined,
        sortBy: 'createdAt',
        order: 'desc',
      };

      const response = await routesService.getRoutes(params);

      setRoutes(response.data);
      setTotal(response.meta.total);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : 'Unable to load routes';

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search]);

  useEffect(() => {
    const loadData = async () => {
      await loadRoutes();
    };

    void loadData();
  }, [loadRoutes]);

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearch('');
    setPage(1);
  };

  const handleDelete = useCallback(
    async (route: Route) => {
      const confirmed = window.confirm(
        `Are you sure you want to delete the route "${route.name}"?`,
      );

      if (!confirmed) {
        return;
      }

      try {
        setDeletingRouteId(route.id);
        setError('');

        await routesService.deleteRoute(route.id);

        if (routes.length === 1 && page > 1) {
          setPage((currentPage) => currentPage - 1);
        } else {
          await loadRoutes();
        }
      } catch (requestError) {
        const message =
          requestError instanceof Error
            ? requestError.message
            : 'Unable to delete route';

        setError(message);
      } finally {
        setDeletingRouteId(null);
      }
    },
    [loadRoutes, page, routes.length],
  );

  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: 'Name',
        render: (route: Route) => route.name,
      },
      {
        key: 'description',
        header: 'Description',
        render: (route: Route) => route.description || '-',
      },
      {
        key: 'debtCollectors',
        header: 'Debt Collectors',
        render: (route: Route) => route.debtCollectors.length,
      },
      {
        key: 'loans',
        header: 'Loans',
        render: (route: Route) => route.loanCount,
      },
      {
        key: 'createdAt',
        header: 'Created',
        render: (route: Route) =>
          new Date(route.createdAt).toLocaleDateString(),
      },
      {
        key: 'actions',
        header: 'Actions',
        render: (route: Route) => (
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => navigate(`/routes/${route.id}`)}
            >
              View
            </Button>

            <Button
              size="small"
              variant="outlined"
              onClick={() => navigate(`/routes/${route.id}/edit`)}
            >
              Edit
            </Button>

            <Button
              size="small"
              variant="outlined"
              color="error"
              disabled={deletingRouteId === route.id}
              onClick={() => void handleDelete(route)}
            >
              {deletingRouteId === route.id ? 'Deleting...' : 'Delete'}
            </Button>
          </Stack>
        ),
      },
    ],
    [deletingRouteId, handleDelete, navigate],
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
              Routes
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Manage your loan portfolios and collection routes.
            </Typography>
          </Box>

          <Button variant="contained" onClick={() => navigate('/routes/new')}>
            Create Route
          </Button>
        </Stack>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            alignItems: {
              xs: 'stretch',
              sm: 'center',
            },
          }}
        >
          <TextField
            label="Search routes"
            placeholder="Search by name"
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

          <Button variant="contained" onClick={handleSearch} disabled={loading}>
            Search
          </Button>

          <Button
            variant="outlined"
            onClick={handleClearSearch}
            disabled={!searchInput && !search}
          >
            Clear
          </Button>
        </Stack>

        {error && <Alert severity="error">{error}</Alert>}

        {loading && routes.length === 0 ? (
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
            data={routes}
            rowKey={(route) => route.id}
            loading={loading}
            emptyMessage="No routes found"
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

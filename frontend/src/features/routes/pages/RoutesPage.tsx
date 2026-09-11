import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  Users,
} from 'lucide-react'
import { Alert, Box, Button, Stack } from '@mui/material'

import {
  DataTable,
  DataTableStatusChip,
  type DataTableAction,
  type DataTableColumn,
  type DataTableFilter,
  type DataTableFilterValues,
  type DataTableStatusTab,
  type DataTableTone,
} from '@/shared/components/DataTable'
import { PageHeader } from '@/shared/components/layouts/PageHeader'

import { routesService } from '../services/routes.service'
import type { GetRoutesParams, Route } from '../types/routes.types'

type RouteActivity = 'ACTIVE' | 'EMPTY'

const ACTIVITY_TONE: Record<RouteActivity, DataTableTone> = {
  ACTIVE: 'brand',
  EMPTY: 'neutral',
}

const getRouteActivity = (route: Route): RouteActivity =>
  route.loanCount > 0 ? 'ACTIVE' : 'EMPTY'

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('es-CO')

/**
 * Routes list page using the shared DataTable surface (parity with Loans).
 */
export default function RoutesPage() {
  const { t } = useTranslation('routes/list')
  const navigate = useNavigate()

  const [routes, setRoutes] = useState<Route[]>([])
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [activity, setActivity] = useState<RouteActivity | ''>('')
  const [hasCollectors, setHasCollectors] = useState<'' | 'yes' | 'no'>('')
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [deletingRouteId, setDeletingRouteId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const loadRoutes = useCallback(async () => {
    const params: GetRoutesParams = {
      page,
      limit: rowsPerPage,
      search: search || undefined,
      hasLoans:
        activity === 'ACTIVE' ? true : activity === 'EMPTY' ? false : undefined,
      hasCollectors:
        hasCollectors === 'yes'
          ? true
          : hasCollectors === 'no'
            ? false
            : undefined,
      sortBy: 'createdAt',
      order: 'desc',
    }

    try {
      setLoading(true)
      setError('')
      const response = await routesService.getRoutes(params)
      setRoutes(response.data)
      setTotal(response.meta.total)
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : t('errors.load')
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [activity, hasCollectors, page, rowsPerPage, search, t])

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setSearch(searchInput.trim())
    }, 300)
    return () => window.clearTimeout(handle)
  }, [searchInput])

  useEffect(() => {
    setPage(1)
    setSelectedKeys([])
  }, [search])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      const params: GetRoutesParams = {
        page,
        limit: rowsPerPage,
        search: search || undefined,
        hasLoans:
          activity === 'ACTIVE'
            ? true
            : activity === 'EMPTY'
              ? false
              : undefined,
        hasCollectors:
          hasCollectors === 'yes'
            ? true
            : hasCollectors === 'no'
              ? false
              : undefined,
        sortBy: 'createdAt',
        order: 'desc',
      }

      try {
        setLoading(true)
        setError('')
        const response = await routesService.getRoutes(params)
        if (cancelled) return
        setRoutes(response.data)
        setTotal(response.meta.total)
      } catch (requestError) {
        if (cancelled) return
        const message =
          requestError instanceof Error
            ? requestError.message
            : t('errors.load')
        setError(message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [activity, hasCollectors, page, rowsPerPage, search, t])

  const handleClearFilters = () => {
    setSearchInput('')
    setSearch('')
    setActivity('')
    setHasCollectors('')
    setSelectedKeys([])
    setPage(1)
  }

  const handleStatusTabChange = (tabId: string) => {
    setActivity(tabId === 'all' ? '' : (tabId as RouteActivity))
    setSelectedKeys([])
    setPage(1)
  }

  const handleFilterChange = (filterId: string, value: string | string[]) => {
    const nextValue = Array.isArray(value) ? (value[0] ?? '') : value
    if (filterId === 'hasCollectors') {
      setHasCollectors(nextValue as '' | 'yes' | 'no')
      setSelectedKeys([])
      setPage(1)
    }
  }

  const handleDelete = useCallback(
    async (route: Route) => {
      const confirmed = window.confirm(
        t('confirmDelete', { name: route.name }),
      )
      if (!confirmed) return

      try {
        setDeletingRouteId(route.id)
        setError('')
        await routesService.deleteRoute(route.id)
        setSelectedKeys((keys) => keys.filter((key) => key !== route.id))
        if (routes.length === 1 && page > 1) {
          setPage((currentPage) => currentPage - 1)
        } else {
          await loadRoutes()
        }
      } catch (requestError) {
        const message =
          requestError instanceof Error
            ? requestError.message
            : t('errors.delete')
        setError(message)
      } finally {
        setDeletingRouteId(null)
      }
    },
    [loadRoutes, page, routes.length, t],
  )

  const columns = useMemo<DataTableColumn<Route>[]>(
    () => [
      {
        key: 'name',
        header: t('columns.name'),
        render: (route) => route.name,
      },
      {
        key: 'description',
        header: t('columns.description'),
        render: (route) => route.description || '—',
      },
      {
        key: 'activity',
        header: t('columns.activity'),
        render: (route) => {
          const nextActivity = getRouteActivity(route)
          return (
            <DataTableStatusChip
              label={t(`activity.${nextActivity}`)}
              tone={ACTIVITY_TONE[nextActivity]}
            />
          )
        },
      },
      {
        key: 'debtCollectors',
        header: t('columns.debtCollectors'),
        align: 'right',
        render: (route) => route.debtCollectors.length,
      },
      {
        key: 'loans',
        header: t('columns.loans'),
        align: 'right',
        render: (route) => route.loanCount,
      },
      {
        key: 'createdAt',
        header: t('columns.createdAt'),
        render: (route) => formatDate(route.createdAt),
      },
    ],
    [t],
  )

  const actions = useMemo<DataTableAction<Route>[]>(
    () => [
      {
        id: 'view',
        label: t('actions.view'),
        icon: Eye,
        getHref: (route) => `/routes/${route.id}`,
      },
      {
        id: 'edit',
        label: t('actions.edit'),
        icon: Pencil,
        getHref: (route) => `/routes/${route.id}/edit`,
      },
      {
        id: 'delete',
        label: t('actions.delete'),
        icon: Trash2,
        danger: true,
        disabled: (route) => deletingRouteId === route.id,
        onClick: (route) => {
          void handleDelete(route)
        },
      },
    ],
    [deletingRouteId, handleDelete, t],
  )

  const filters = useMemo<DataTableFilter[]>(
    () => [
      {
        id: 'hasCollectors',
        label: t('filters.hasCollectors'),
        icon: Users,
        multiple: false,
        options: [
          { value: 'yes', label: t('filters.withCollectors') },
          { value: 'no', label: t('filters.withoutCollectors') },
        ],
      },
    ],
    [t],
  )

  const filterValues = useMemo<DataTableFilterValues>(
    () => ({
      hasCollectors,
    }),
    [hasCollectors],
  )

  const statusTabs = useMemo<DataTableStatusTab[]>(
    () => [
      { id: 'all', label: t('tabs.all'), tone: 'neutral' },
      {
        id: 'ACTIVE',
        label: t('activity.ACTIVE'),
        tone: ACTIVITY_TONE.ACTIVE,
      },
      {
        id: 'EMPTY',
        label: t('activity.EMPTY'),
        tone: ACTIVITY_TONE.EMPTY,
      },
    ],
    [t],
  )

  return (
    <Box
      sx={{
        p: 0,
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        alignSelf: 'stretch',
        boxSizing: 'border-box',
      }}
    >
      <Stack spacing={3} sx={{ width: '100%', minWidth: 0 }}>
        <PageHeader
          title={t('title')}
          description={t('subtitle')}
          actions={
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              startIcon={<Plus size={18} strokeWidth={2.25} aria-hidden />}
              onClick={() => navigate('/routes/new')}
            >
              {t('createRoute')}
            </Button>
          }
        />

        {error ? <Alert severity="error">{error}</Alert> : null}

        <DataTable
          columns={columns}
          data={routes}
          rowKey={(route) => route.id}
          loading={loading}
          emptyMessage={t('empty')}
          searchValue={searchInput}
          searchPlaceholder={t('searchPlaceholder')}
          onSearchChange={setSearchInput}
          filters={filters}
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          filtersLabel={t('filters.label')}
          clearFiltersLabel={t('filters.clear')}
          statusTabs={statusTabs}
          activeStatusTab={activity || 'all'}
          onStatusTabChange={handleStatusTabChange}
          selectable
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          actions={actions}
          actionsAriaLabel={t('actions.menu')}
          getActionsAriaLabel={(route) =>
            t('actions.menuFor', { name: route.name })
          }
          getRowHref={(route) => `/routes/${route.id}`}
          page={page - 1}
          rowsPerPage={rowsPerPage}
          total={total}
          onPageChange={(nextPage) => {
            setPage(nextPage + 1)
          }}
          onRowsPerPageChange={(nextRowsPerPage) => {
            setRowsPerPage(nextRowsPerPage)
            setPage(1)
          }}
          previousPageLabel={t('pagination.prev')}
          nextPageLabel={t('pagination.next')}
          rowsPerPageLabel={t('pagination.rows')}
          rangeLabel={(start, end, totalCount) =>
            t('pagination.range', { start, end, total: totalCount })
          }
          selectedCountLabel={(count) =>
            t('pagination.selected', { count })
          }
          loadingLabel={t('loading')}
          regionLabel={t('title')}
          statusTabsLabel={t('filters.activity')}
        />
      </Stack>
    </Box>
  )
}

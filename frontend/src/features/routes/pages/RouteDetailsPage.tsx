import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Clock3,
  Hash,
  MapPinned,
  Pencil,
  Plus,
  Route as RouteIcon,
  UserRound,
  Users,
  Wallet,
} from 'lucide-react'
import { Alert, Box, Button, CircularProgress } from '@mui/material'

import {
  DataTable,
  DataTableStatusChip,
  type DataTableColumn,
  type DataTableTone,
} from '@/shared/components/DataTable'
import {
  DetailField,
  DetailMetric,
  DetailSection,
  DetailSurface,
  DetailTabPanel,
  DetailTabs,
  type DetailTabItem,
} from '@/shared/components/DetailSurface'
import { PageHeader } from '@/shared/components/layouts/PageHeader'

import AddRouteLoanForm from '../components/loans/AddRouteLoanForm'
import RouteLoansTable from '../components/loans/RouteLoansTable'

import { debtCollectorsService } from '../../debt-collectors/services/debt-collectors.service'
import type { DebtCollector } from '../../debt-collectors/types/debt-collectors.types'

import { routesService } from '../services/routes.service'
import type { Route } from '../types/routes.types'

type RouteDetailTab = 'info' | 'collectors' | 'loans'

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString('es-CO')

/**
 * Route detail page aligned with dashboard surface tokens and Lucide icons.
 */
export default function RouteDetailsPage() {
  const { t } = useTranslation('routes/details')
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const [route, setRoute] = useState<Route | null>(null)
  const [debtCollectors, setDebtCollectors] = useState<DebtCollector[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddLoan, setShowAddLoan] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<RouteDetailTab>('info')
  const [collectorsPage, setCollectorsPage] = useState(0)
  const [collectorsRowsPerPage, setCollectorsRowsPerPage] = useState(10)

  const loadRouteData = useCallback(async () => {
    if (!id) {
      return
    }

    try {
      setLoading(true)
      setError('')

      const [routeResponse, debtCollectorsResponse] = await Promise.all([
        routesService.getRouteById(id),
        debtCollectorsService.getAllDebtCollectors(),
      ])

      setRoute(routeResponse)
      setDebtCollectors(debtCollectorsResponse)
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : t('errors.load')
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [id, t])

  useEffect(() => {
    if (!id) {
      return
    }

    void loadRouteData()
  }, [id, loadRouteData])

  const assignedDebtCollectors = useMemo(
    () =>
      debtCollectors.filter((collector) =>
        route?.debtCollectors.includes(collector.id),
      ),
    [debtCollectors, route?.debtCollectors],
  )

  const pagedCollectors = useMemo(
    () =>
      assignedDebtCollectors.slice(
        collectorsPage * collectorsRowsPerPage,
        collectorsPage * collectorsRowsPerPage + collectorsRowsPerPage,
      ),
    [assignedDebtCollectors, collectorsPage, collectorsRowsPerPage],
  )

  const collectorColumns = useMemo<DataTableColumn<DebtCollector>[]>(
    () => [
      {
        key: 'name',
        header: t('collectors.columns.name'),
        render: (collector) => collector.name,
      },
      {
        key: 'email',
        header: t('collectors.columns.email'),
        render: (collector) => collector.email,
      },
      {
        key: 'phone',
        header: t('collectors.columns.phone'),
        render: (collector) => collector.phone || '—',
      },
      {
        key: 'status',
        header: t('collectors.columns.status'),
        render: () => (
          <DataTableStatusChip
            label={t('collectors.assigned')}
            tone="brand"
          />
        ),
      },
    ],
    [t],
  )

  const tabs = useMemo<DetailTabItem[]>(
    () => [
      {
        id: 'info',
        label: t('tabs.info'),
        icon: <RouteIcon size={15} strokeWidth={2.25} />,
      },
      {
        id: 'collectors',
        label: t('tabs.collectors'),
        icon: <Users size={15} strokeWidth={2.25} />,
        count: assignedDebtCollectors.length,
      },
      {
        id: 'loans',
        label: t('tabs.loans'),
        icon: <Wallet size={15} strokeWidth={2.25} />,
        count: route?.loanCount ?? 0,
      },
    ],
    [assignedDebtCollectors.length, route?.loanCount, t],
  )

  const isActive = (route?.loanCount ?? 0) > 0
  const activityTone: DataTableTone = isActive ? 'brand' : 'neutral'
  const activityLabel = isActive
    ? t('activity.ACTIVE')
    : t('activity.EMPTY')

  if (!id) {
    return (
      <DetailSurface ariaLabel={t('titleFallback')}>
        <div className="detail-surface__state">
          <Alert severity="error">{t('missingId')}</Alert>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ArrowLeft size={18} strokeWidth={2.25} aria-hidden />}
            onClick={() => navigate('/routes')}
          >
            {t('backToList')}
          </Button>
        </div>
      </DetailSurface>
    )
  }

  if (loading) {
    return (
      <DetailSurface ariaLabel={t('titleFallback')}>
        <div className="detail-surface__loading" role="status" aria-live="polite">
          <CircularProgress size={36} />
          <span className="sr-only">{t('loading')}</span>
        </div>
      </DetailSurface>
    )
  }

  if (!route) {
    return (
      <DetailSurface ariaLabel={t('titleFallback')}>
        <div className="detail-surface__state">
          <Alert severity="error">{error || t('notFound')}</Alert>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ArrowLeft size={18} strokeWidth={2.25} aria-hidden />}
            onClick={() => navigate('/routes')}
          >
            {t('backToList')}
          </Button>
        </div>
      </DetailSurface>
    )
  }

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
      <DetailSurface ariaLabel={route.name}>
        {error ? <Alert severity="error">{error}</Alert> : null}

        <PageHeader
          title={route.name}
          description={route.description || t('noDescription')}
          actions={
            <>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<ArrowLeft size={18} strokeWidth={2.25} aria-hidden />}
                onClick={() => navigate('/routes')}
              >
                {t('back')}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<Pencil size={18} strokeWidth={2.25} aria-hidden />}
                onClick={() => navigate(`/routes/${route.id}/edit`)}
              >
                {t('edit')}
              </Button>
            </>
          }
        />

        <div className="detail-surface__hero detail-surface__hero--accent">
          <div className="detail-surface__hero-top">
            <p className="detail-surface__hero-label">{t('hero.overviewLabel')}</p>
            <DataTableStatusChip label={activityLabel} tone={activityTone} />
          </div>
          <div>
            <p className="detail-surface__hero-amount" aria-hidden>
              {route.name}
            </p>
            <p className="detail-surface__hero-sub">
              {route.description || t('noDescriptionLong')}
            </p>
          </div>
        </div>

        <div className="detail-surface__metrics detail-surface__metrics--3">
          <DetailMetric
            icon={<Wallet size={16} strokeWidth={2.25} />}
            label={t('metrics.loans')}
            value={route.loanCount}
            hint={t('metrics.loansHint')}
          />
          <DetailMetric
            icon={<Users size={16} strokeWidth={2.25} />}
            label={t('metrics.collectors')}
            value={assignedDebtCollectors.length}
            hint={t('metrics.collectorsHint')}
          />
          <DetailMetric
            icon={<Clock3 size={16} strokeWidth={2.25} />}
            label={t('metrics.updated')}
            value={formatDateTime(route.updatedAt)}
            hint={t('metrics.created', {
              date: formatDateTime(route.createdAt),
            })}
          />
        </div>

        <DetailTabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(tabId) => setActiveTab(tabId as RouteDetailTab)}
          ariaLabel={t('tabsLabel')}
          idPrefix="route-detail"
        />

        <DetailTabPanel tabId="info" activeTab={activeTab} idPrefix="route-detail">
          <DetailSection
            icon={<RouteIcon size={18} strokeWidth={2.25} />}
            title={t('sections.info')}
            description={t('sections.infoDesc')}
          >
            <div className="detail-surface__fields detail-surface__fields--2">
              <DetailField
                icon={<Hash size={12} strokeWidth={2.25} />}
                label={t('fields.routeId')}
                value={route.id}
              />
              <DetailField
                icon={<UserRound size={12} strokeWidth={2.25} />}
                label={t('fields.lenderId')}
                value={route.lenderId}
              />
              <DetailField
                icon={<Wallet size={12} strokeWidth={2.25} />}
                label={t('fields.loans')}
                value={route.loanCount}
              />
              <DetailField
                icon={<Clock3 size={12} strokeWidth={2.25} />}
                label={t('fields.created')}
                value={formatDateTime(route.createdAt)}
              />
              <DetailField
                icon={<Clock3 size={12} strokeWidth={2.25} />}
                label={t('fields.updated')}
                value={formatDateTime(route.updatedAt)}
              />
            </div>
          </DetailSection>
        </DetailTabPanel>

        <DetailTabPanel
          tabId="collectors"
          activeTab={activeTab}
          idPrefix="route-detail"
        >
          <DetailSection
            icon={<MapPinned size={18} strokeWidth={2.25} />}
            title={t('sections.collectors')}
            description={t('sections.collectorsDesc')}
          >
            <DataTable
              columns={collectorColumns}
              data={pagedCollectors}
              rowKey={(collector) => collector.id}
              emptyMessage={t('collectors.emptyTitle')}
              page={collectorsPage}
              rowsPerPage={collectorsRowsPerPage}
              total={assignedDebtCollectors.length}
              onPageChange={setCollectorsPage}
              onRowsPerPageChange={(nextRowsPerPage) => {
                setCollectorsRowsPerPage(nextRowsPerPage)
                setCollectorsPage(0)
              }}
              previousPageLabel={t('pagination.prev')}
              nextPageLabel={t('pagination.next')}
              rowsPerPageLabel={t('pagination.rows')}
              rangeLabel={(start, end, totalCount) =>
                t('pagination.range', { start, end, total: totalCount })
              }
              regionLabel={t('sections.collectors')}
            />
          </DetailSection>
        </DetailTabPanel>

        <DetailTabPanel tabId="loans" activeTab={activeTab} idPrefix="route-detail">
          <DetailSection
            icon={<Wallet size={18} strokeWidth={2.25} />}
            title={t('sections.loans')}
            description={t('sections.loansDesc')}
            actions={
              showAddLoan ? null : (
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<Plus size={18} strokeWidth={2.25} aria-hidden />}
                  onClick={() => setShowAddLoan(true)}
                >
                  {t('addLoan')}
                </Button>
              )
            }
          >
            {showAddLoan ? (
              <AddRouteLoanForm
                routeId={route.id}
                onSuccess={async () => {
                  setShowAddLoan(false)
                  await loadRouteData()
                }}
                onCancel={() => setShowAddLoan(false)}
              />
            ) : null}

            <RouteLoansTable
              routeId={route.id}
              loans={route.loans}
              onChange={() => {
                void loadRouteData()
              }}
            />
          </DetailSection>
        </DetailTabPanel>
      </DetailSurface>
    </Box>
  )
}

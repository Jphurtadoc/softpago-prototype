import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BadgeDollarSign,
  CalendarClock,
  Clock3,
  Hash,
  MapPinned,
  Pencil,
  Percent,
  Route as RouteIcon,
  UserRound,
  Users,
  Wallet,
} from 'lucide-react'
import { Alert, Box, Button, CircularProgress, Stack } from '@mui/material'

import {
  DataTableStatusChip,
  type DataTableTone,
} from '@/shared/components/DataTable'
import {
  DetailField,
  DetailMetric,
  DetailProgress,
  DetailSection,
  DetailSurface,
  DetailTabPanel,
  DetailTabs,
  type DetailTabItem,
} from '@/shared/components/DetailSurface'
import { PageHeader } from '@/shared/components/layouts/PageHeader'

import { loansService } from '../services/loans.service'
import type {
  Loan,
  LoanFrequency,
  LoanInterestType,
  LoanStatus,
} from '../types/loans.types'

type LoanDetailTab = 'parties' | 'financial' | 'schedule' | 'record'

const STATUS_TONE: Record<LoanStatus, DataTableTone> = {
  ACTIVE: 'brand',
  PAID: 'success',
  OVERDUE: 'danger',
  CANCELLED: 'neutral',
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('es-CO')

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString('es-CO')

/**
 * Loan detail page aligned with dashboard surface tokens and Lucide icons.
 */
export default function LoanDetailsPage() {
  const { t } = useTranslation('loans/details')
  const { t: tList } = useTranslation('loans/list')
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const [loan, setLoan] = useState<Loan | null>(null)
  const [loading, setLoading] = useState(Boolean(id))
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<LoanDetailTab>('parties')

  useEffect(() => {
    if (!id) {
      return
    }

    const loadLoan = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await loansService.getLoanById(id)
        setLoan(response)
      } catch (requestError) {
        const message =
          requestError instanceof Error
            ? requestError.message
            : t('errors.load')
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    void loadLoan()
  }, [id, t])

  const remainingBalance = useMemo(() => {
    if (!loan) {
      return 0
    }
    const remainingInstallments = Math.max(
      loan.numberOfInstallments - loan.paidInstallments,
      0,
    )
    return remainingInstallments * loan.installmentAmount
  }, [loan])

  const tabs = useMemo<DetailTabItem[]>(
    () => [
      {
        id: 'parties',
        label: t('tabs.parties'),
        icon: <Users size={15} strokeWidth={2.25} />,
      },
      {
        id: 'financial',
        label: t('tabs.financial'),
        icon: <Wallet size={15} strokeWidth={2.25} />,
      },
      {
        id: 'schedule',
        label: t('tabs.schedule'),
        icon: <CalendarClock size={15} strokeWidth={2.25} />,
      },
      {
        id: 'record',
        label: t('tabs.record'),
        icon: <Clock3 size={15} strokeWidth={2.25} />,
      },
    ],
    [t],
  )

  const formatStatus = (value: LoanStatus) => tList(`status.${value}`)
  const formatFrequency = (value: LoanFrequency) => tList(`frequency.${value}`)
  const formatInterestType = (value: LoanInterestType) =>
    tList(`interestType.${value}`)

  if (!id) {
    return (
      <DetailSurface ariaLabel={t('title')}>
        <div className="detail-surface__state">
          <Alert severity="error">{t('missingId')}</Alert>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ArrowLeft size={18} strokeWidth={2.25} aria-hidden />}
            onClick={() => navigate('/loans')}
          >
            {t('backToList')}
          </Button>
        </div>
      </DetailSurface>
    )
  }

  if (loading) {
    return (
      <DetailSurface ariaLabel={t('title')}>
        <div className="detail-surface__loading" role="status" aria-live="polite">
          <CircularProgress size={36} />
          <span className="sr-only">{t('loading')}</span>
        </div>
      </DetailSurface>
    )
  }

  if (!loan) {
    return (
      <DetailSurface ariaLabel={t('title')}>
        <div className="detail-surface__state">
          <Alert severity="error">{error || t('notFound')}</Alert>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ArrowLeft size={18} strokeWidth={2.25} aria-hidden />}
            onClick={() => navigate('/loans')}
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
      <DetailSurface ariaLabel={`${t('title')} ${loan.id}`}>
        {error ? <Alert severity="error">{error}</Alert> : null}

        <PageHeader
          title={t('title')}
          description={t('subtitle')}
          actions={
            <>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<ArrowLeft size={18} strokeWidth={2.25} aria-hidden />}
                onClick={() => navigate('/loans')}
              >
                {t('back')}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<Pencil size={18} strokeWidth={2.25} aria-hidden />}
                onClick={() => navigate(`/loans/${loan.id}/edit`)}
              >
                {t('edit')}
              </Button>
            </>
          }
        />

        <div className="detail-surface__hero detail-surface__hero--accent">
          <div className="detail-surface__hero-top">
            <p className="detail-surface__hero-label">{t('hero.totalLabel')}</p>
            <DataTableStatusChip
              label={formatStatus(loan.status)}
              tone={STATUS_TONE[loan.status]}
            />
          </div>
          <div>
            <p className="detail-surface__hero-amount">
              {formatCurrency(loan.totalAmount)}
            </p>
            <p className="detail-surface__hero-sub">
              {t('hero.principalInterest', {
                amount: formatCurrency(loan.amount),
                rate: loan.interestRate,
                type: formatInterestType(loan.interestType),
              })}
            </p>
          </div>
          <DetailProgress
            value={loan.paidInstallments}
            max={loan.numberOfInstallments}
            label={t('hero.installmentsPaid')}
            meta={`${loan.paidInstallments} / ${loan.numberOfInstallments}`}
          />
        </div>

        <div className="detail-surface__metrics">
          <DetailMetric
            icon={<Wallet size={16} strokeWidth={2.25} />}
            label={t('metrics.installment')}
            value={formatCurrency(loan.installmentAmount)}
            hint={formatFrequency(loan.frequency)}
          />
          <DetailMetric
            icon={<BadgeDollarSign size={16} strokeWidth={2.25} />}
            label={t('metrics.remaining')}
            value={formatCurrency(remainingBalance)}
            hint={t('metrics.remainingHint')}
          />
          <DetailMetric
            icon={<CalendarClock size={16} strokeWidth={2.25} />}
            label={t('metrics.dueDate')}
            value={formatDate(loan.dueDate)}
            hint={t('metrics.started', { date: formatDate(loan.startDate) })}
          />
          <DetailMetric
            icon={<Percent size={16} strokeWidth={2.25} />}
            label={t('metrics.interest')}
            value={`${loan.interestRate}%`}
            hint={formatInterestType(loan.interestType)}
          />
        </div>

        <DetailTabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(tabId) => setActiveTab(tabId as LoanDetailTab)}
          ariaLabel={t('tabsLabel')}
          idPrefix="loan-detail"
        />

        <DetailTabPanel tabId="parties" activeTab={activeTab} idPrefix="loan-detail">
          <DetailSection
            icon={<Users size={18} strokeWidth={2.25} />}
            title={t('sections.parties')}
            description={t('sections.partiesDesc')}
          >
            <div className="detail-surface__fields detail-surface__fields--2">
              <DetailField
                icon={<Hash size={12} strokeWidth={2.25} />}
                label={t('fields.loanId')}
                value={loan.id}
              />
              <DetailField
                icon={<UserRound size={12} strokeWidth={2.25} />}
                label={t('fields.lenderId')}
                value={loan.lenderId}
              />
              <DetailField
                icon={<UserRound size={12} strokeWidth={2.25} />}
                label={t('fields.borrowerId')}
                value={loan.borrowerId}
              />
              <DetailField
                icon={<RouteIcon size={12} strokeWidth={2.25} />}
                label={t('fields.routeId')}
                value={loan.routeId || t('fields.notAssigned')}
              />
              <DetailField
                icon={<MapPinned size={12} strokeWidth={2.25} />}
                label={t('fields.debtCollectorId')}
                value={loan.debtCollectorId || t('fields.notAssigned')}
              />
            </div>
          </DetailSection>
        </DetailTabPanel>

        <DetailTabPanel
          tabId="financial"
          activeTab={activeTab}
          idPrefix="loan-detail"
        >
          <DetailSection
            icon={<Wallet size={18} strokeWidth={2.25} />}
            title={t('sections.financial')}
            description={t('sections.financialDesc')}
          >
            <div className="detail-surface__fields detail-surface__fields--2">
              <DetailField
                icon={<Wallet size={12} strokeWidth={2.25} />}
                label={t('fields.amount')}
                value={formatCurrency(loan.amount)}
              />
              <DetailField
                icon={<Percent size={12} strokeWidth={2.25} />}
                label={t('fields.interest')}
                value={`${loan.interestRate}% (${formatInterestType(loan.interestType)})`}
              />
              <DetailField
                icon={<BadgeDollarSign size={12} strokeWidth={2.25} />}
                label={t('fields.totalAmount')}
                value={formatCurrency(loan.totalAmount)}
              />
              <DetailField
                icon={<BadgeDollarSign size={12} strokeWidth={2.25} />}
                label={t('fields.installmentAmount')}
                value={formatCurrency(loan.installmentAmount)}
              />
            </div>
          </DetailSection>
        </DetailTabPanel>

        <DetailTabPanel
          tabId="schedule"
          activeTab={activeTab}
          idPrefix="loan-detail"
        >
          <DetailSection
            icon={<CalendarClock size={18} strokeWidth={2.25} />}
            title={t('sections.schedule')}
            description={t('sections.scheduleDesc')}
          >
            <Stack spacing={2}>
              <div className="detail-surface__fields detail-surface__fields--2">
                <DetailField
                  icon={<CalendarClock size={12} strokeWidth={2.25} />}
                  label={t('fields.frequency')}
                  value={formatFrequency(loan.frequency)}
                />
                <DetailField
                  icon={<Hash size={12} strokeWidth={2.25} />}
                  label={t('fields.installments')}
                  value={`${loan.paidInstallments} / ${loan.numberOfInstallments}`}
                />
                <DetailField
                  icon={<Clock3 size={12} strokeWidth={2.25} />}
                  label={t('fields.startDate')}
                  value={formatDate(loan.startDate)}
                />
                <DetailField
                  icon={<Clock3 size={12} strokeWidth={2.25} />}
                  label={t('fields.dueDate')}
                  value={formatDate(loan.dueDate)}
                />
              </div>
              <DetailProgress
                value={loan.paidInstallments}
                max={loan.numberOfInstallments}
                label={t('progress.payment')}
              />
            </Stack>
          </DetailSection>
        </DetailTabPanel>

        <DetailTabPanel tabId="record" activeTab={activeTab} idPrefix="loan-detail">
          <DetailSection
            icon={<Clock3 size={18} strokeWidth={2.25} />}
            title={t('sections.record')}
            description={t('sections.recordDesc')}
          >
            <div className="detail-surface__fields detail-surface__fields--2">
              <DetailField
                icon={<Clock3 size={12} strokeWidth={2.25} />}
                label={t('fields.created')}
                value={formatDateTime(loan.createdAt)}
              />
              <DetailField
                icon={<Clock3 size={12} strokeWidth={2.25} />}
                label={t('fields.updated')}
                value={formatDateTime(loan.updatedAt)}
              />
            </div>
          </DetailSection>
        </DetailTabPanel>
      </DetailSurface>
    </Box>
  )
}

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarClock,
  Save,
  Users,
  Wallet,
} from 'lucide-react'
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
  TextField,
} from '@mui/material'

import { DetailSection, DetailSurface } from '@/shared/components/DetailSurface'
import { PageHeader } from '@/shared/components/layouts/PageHeader'

import { loansService } from '../services/loans.service'
import type {
  LoanFrequency,
  LoanInterestType,
  LoanStatus,
  UpdateLoanRequest,
} from '../types/loans.types'

const FREQUENCY_OPTIONS: LoanFrequency[] = [
  'DAILY',
  'WEEKLY',
  'BIWEEKLY',
  'MONTHLY',
]

const INTEREST_TYPE_OPTIONS: LoanInterestType[] = ['FIXED', 'PERIODIC']

const STATUS_OPTIONS: LoanStatus[] = ['ACTIVE', 'PAID', 'OVERDUE', 'CANCELLED']

/**
 * Loan edit page using DetailSurface sections and brand actions.
 */
export default function EditLoanPage() {
  const { t } = useTranslation('loans/edit')
  const { t: tList } = useTranslation('loans/list')
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const [borrowerId, setBorrowerId] = useState('')
  const [routeId, setRouteId] = useState('')
  const [debtCollectorId, setDebtCollectorId] = useState('')
  const [amount, setAmount] = useState('')
  const [interestType, setInterestType] = useState<LoanInterestType>('FIXED')
  const [interestRate, setInterestRate] = useState('')
  const [totalAmount, setTotalAmount] = useState('')
  const [installmentAmount, setInstallmentAmount] = useState('')
  const [numberOfInstallments, setNumberOfInstallments] = useState('')
  const [paidInstallments, setPaidInstallments] = useState('0')
  const [frequency, setFrequency] = useState<LoanFrequency>('MONTHLY')
  const [status, setStatus] = useState<LoanStatus>('ACTIVE')
  const [startDate, setStartDate] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [loading, setLoading] = useState(Boolean(id))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) {
      return
    }

    const loadLoan = async () => {
      try {
        setLoading(true)
        setError('')
        const loan = await loansService.getLoanById(id)
        setBorrowerId(loan.borrowerId)
        setRouteId(loan.routeId ?? '')
        setDebtCollectorId(loan.debtCollectorId ?? '')
        setAmount(String(loan.amount))
        setInterestType(loan.interestType)
        setInterestRate(String(loan.interestRate))
        setTotalAmount(String(loan.totalAmount))
        setInstallmentAmount(String(loan.installmentAmount))
        setNumberOfInstallments(String(loan.numberOfInstallments))
        setPaidInstallments(String(loan.paidInstallments))
        setFrequency(loan.frequency)
        setStatus(loan.status)
        setStartDate(loan.startDate.slice(0, 10))
        setDueDate(loan.dueDate.slice(0, 10))
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!id) {
      setError(t('missingId'))
      return
    }

    if (!borrowerId.trim()) {
      setError(t('errors.borrowerRequired'))
      return
    }

    try {
      setSaving(true)
      setError('')

      const data: UpdateLoanRequest = {
        borrowerId: borrowerId.trim(),
        routeId: routeId.trim() || undefined,
        debtCollectorId: debtCollectorId.trim() || undefined,
        amount: Number(amount),
        interestType,
        interestRate: Number(interestRate),
        totalAmount: Number(totalAmount),
        installmentAmount: Number(installmentAmount),
        numberOfInstallments: Number(numberOfInstallments),
        paidInstallments: Number(paidInstallments),
        frequency,
        status,
        startDate,
        dueDate,
      }

      await loansService.updateLoan(id, data)
      navigate(`/loans/${id}`)
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : t('errors.update')
      setError(message)
    } finally {
      setSaving(false)
    }
  }

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

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 0,
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        alignSelf: 'stretch',
        boxSizing: 'border-box',
      }}
    >
      <DetailSurface ariaLabel={t('title')}>
        <PageHeader
          title={t('title')}
          description={t('subtitle')}
          actions={
            <>
              <Button
                type="button"
                variant="outlined"
                color="primary"
                startIcon={<ArrowLeft size={18} strokeWidth={2.25} aria-hidden />}
                onClick={() => navigate(`/loans/${id}`)}
                disabled={saving}
              >
                {t('back')}
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                startIcon={<Save size={18} strokeWidth={2.25} aria-hidden />}
                disabled={saving}
              >
                {saving ? t('saving') : t('save')}
              </Button>
            </>
          }
        />

        {error ? <Alert severity="error">{error}</Alert> : null}

        <div className="detail-surface__grid">
          <DetailSection
            icon={<Users size={18} strokeWidth={2.25} />}
            title={t('sections.parties')}
            description={t('sections.partiesDesc')}
          >
            <Stack spacing={2}>
              <TextField
                label={t('fields.borrowerId')}
                value={borrowerId}
                onChange={(event) => setBorrowerId(event.target.value)}
                required
                fullWidth
                disabled={saving}
              />
              <TextField
                label={t('fields.routeId')}
                value={routeId}
                onChange={(event) => setRouteId(event.target.value)}
                fullWidth
                disabled={saving}
              />
              <TextField
                label={t('fields.debtCollectorId')}
                value={debtCollectorId}
                onChange={(event) => setDebtCollectorId(event.target.value)}
                fullWidth
                disabled={saving}
              />
            </Stack>
          </DetailSection>

          <DetailSection
            icon={<Wallet size={18} strokeWidth={2.25} />}
            title={t('sections.financial')}
            description={t('sections.financialDesc')}
          >
            <Stack spacing={2}>
              <TextField
                label={t('fields.amount')}
                type="number"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                required
                fullWidth
                disabled={saving}
              />
              <FormControl fullWidth disabled={saving}>
                <InputLabel id="loan-interest-type-label">
                  {t('fields.interestType')}
                </InputLabel>
                <Select
                  labelId="loan-interest-type-label"
                  value={interestType}
                  label={t('fields.interestType')}
                  onChange={(event) =>
                    setInterestType(event.target.value as LoanInterestType)
                  }
                >
                  {INTEREST_TYPE_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {tList(`interestType.${option}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label={t('fields.interestRate')}
                type="number"
                value={interestRate}
                onChange={(event) => setInterestRate(event.target.value)}
                required
                fullWidth
                disabled={saving}
              />
              <TextField
                label={t('fields.totalAmount')}
                type="number"
                value={totalAmount}
                onChange={(event) => setTotalAmount(event.target.value)}
                required
                fullWidth
                disabled={saving}
              />
              <TextField
                label={t('fields.installmentAmount')}
                type="number"
                value={installmentAmount}
                onChange={(event) => setInstallmentAmount(event.target.value)}
                required
                fullWidth
                disabled={saving}
              />
            </Stack>
          </DetailSection>

          <DetailSection
            wide
            icon={<CalendarClock size={18} strokeWidth={2.25} />}
            title={t('sections.schedule')}
            description={t('sections.scheduleDesc')}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              useFlexGap
              flexWrap="wrap"
            >
              <TextField
                label={t('fields.numberOfInstallments')}
                type="number"
                value={numberOfInstallments}
                onChange={(event) => setNumberOfInstallments(event.target.value)}
                required
                fullWidth
                disabled={saving}
                sx={{ flex: '1 1 180px' }}
              />
              <TextField
                label={t('fields.paidInstallments')}
                type="number"
                value={paidInstallments}
                onChange={(event) => setPaidInstallments(event.target.value)}
                fullWidth
                disabled={saving}
                sx={{ flex: '1 1 180px' }}
              />
              <FormControl fullWidth disabled={saving} sx={{ flex: '1 1 180px' }}>
                <InputLabel id="loan-frequency-label">
                  {t('fields.frequency')}
                </InputLabel>
                <Select
                  labelId="loan-frequency-label"
                  value={frequency}
                  label={t('fields.frequency')}
                  onChange={(event) =>
                    setFrequency(event.target.value as LoanFrequency)
                  }
                >
                  {FREQUENCY_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {tList(`frequency.${option}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth disabled={saving} sx={{ flex: '1 1 180px' }}>
                <InputLabel id="loan-status-label">{t('fields.status')}</InputLabel>
                <Select
                  labelId="loan-status-label"
                  value={status}
                  label={t('fields.status')}
                  onChange={(event) =>
                    setStatus(event.target.value as LoanStatus)
                  }
                >
                  {STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {tList(`status.${option}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label={t('fields.startDate')}
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                required
                fullWidth
                disabled={saving}
                sx={{ flex: '1 1 180px' }}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                label={t('fields.dueDate')}
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                required
                fullWidth
                disabled={saving}
                sx={{ flex: '1 1 180px' }}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Stack>
          </DetailSection>
        </div>

        <Stack
          direction="row"
          spacing={2}
          sx={{ justifyContent: { xs: 'stretch', sm: 'flex-end' }, flexWrap: 'wrap' }}
        >
          <Button
            type="button"
            variant="outlined"
            onClick={() => navigate(`/loans/${id}`)}
            disabled={saving}
          >
            {t('cancel')}
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            startIcon={<Save size={18} strokeWidth={2.25} aria-hidden />}
            disabled={saving}
          >
            {saving ? t('saving') : t('save')}
          </Button>
        </Stack>
      </DetailSurface>
    </Box>
  )
}

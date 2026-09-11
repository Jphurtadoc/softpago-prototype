import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, MapPinned, Route as RouteIcon, Save } from 'lucide-react'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  Stack,
  TextField,
} from '@mui/material'

import { DetailSection, DetailSurface } from '@/shared/components/DetailSurface'
import { EmptyState } from '@/shared/components/EmptyState'
import { PageHeader } from '@/shared/components/layouts/PageHeader'

import { debtCollectorsService } from '../../debt-collectors/services/debt-collectors.service'
import type { DebtCollector } from '../../debt-collectors/types/debt-collectors.types'
import { routesService } from '../services/routes.service'
import type { Route, UpdateRouteRequest } from '../types/routes.types'

/**
 * Route edit page using DetailSurface sections and brand actions.
 */
export default function EditRoutePage() {
  const { t } = useTranslation('routes/edit')
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const [route, setRoute] = useState<Route | null>(null)
  const [debtCollectors, setDebtCollectors] = useState<DebtCollector[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedDebtCollectors, setSelectedDebtCollectors] = useState<
    string[]
  >([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) {
      return
    }

    const loadData = async () => {
      try {
        setLoading(true)
        setError('')
        const [routeResponse, collectorsResponse] = await Promise.all([
          routesService.getRouteById(id),
          debtCollectorsService.getAllDebtCollectors(),
        ])
        setRoute(routeResponse)
        setDebtCollectors(collectorsResponse)
        setName(routeResponse.name)
        setDescription(routeResponse.description ?? '')
        setSelectedDebtCollectors(routeResponse.debtCollectors)
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

    void loadData()
  }, [id, t])

  const handleDebtCollectorChange = (collectorId: string) => {
    setSelectedDebtCollectors((current) => {
      if (current.includes(collectorId)) {
        return current.filter((value) => value !== collectorId)
      }
      return [...current, collectorId]
    })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!id) {
      setError(t('missingId'))
      return
    }

    if (!name.trim()) {
      setError(t('errors.nameRequired'))
      return
    }

    if (selectedDebtCollectors.length === 0) {
      setError(t('errors.collectorsRequired'))
      return
    }

    try {
      setSaving(true)
      setError('')
      const data: UpdateRouteRequest = {
        name: name.trim(),
        description: description.trim() || undefined,
        debtCollectors: selectedDebtCollectors,
      }
      await routesService.updateRoute(id, data)
      navigate(`/routes/${id}`)
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
      <DetailSurface ariaLabel={t('title')}>
        <div className="detail-surface__loading" role="status" aria-live="polite">
          <CircularProgress size={36} />
          <span className="sr-only">{t('loading')}</span>
        </div>
      </DetailSurface>
    )
  }

  if (!route) {
    return (
      <DetailSurface ariaLabel={t('title')}>
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
                onClick={() => navigate(`/routes/${id}`)}
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
            icon={<RouteIcon size={18} strokeWidth={2.25} />}
            title={t('sections.info')}
            description={t('sections.infoDesc')}
          >
            <Stack spacing={2}>
              <TextField
                label={t('fields.name')}
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                fullWidth
                disabled={saving}
              />
              <TextField
                label={t('fields.description')}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                multiline
                minRows={3}
                fullWidth
                disabled={saving}
              />
            </Stack>
          </DetailSection>

          <DetailSection
            icon={<MapPinned size={18} strokeWidth={2.25} />}
            title={t('sections.collectors')}
            description={t('sections.collectorsDesc')}
          >
            {debtCollectors.length === 0 ? (
              <EmptyState
                icon={<MapPinned size={28} strokeWidth={1.75} />}
                title={t('collectors.empty')}
              />
            ) : (
              <FormControl component="fieldset" fullWidth>
                <FormGroup>
                  {debtCollectors.map((collector) => (
                    <FormControlLabel
                      key={collector.id}
                      control={
                        <Checkbox
                          checked={selectedDebtCollectors.includes(collector.id)}
                          onChange={() =>
                            handleDebtCollectorChange(collector.id)
                          }
                          disabled={saving}
                          color="primary"
                        />
                      }
                      label={`${collector.name} (${collector.email})`}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            )}
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
            onClick={() => navigate(`/routes/${id}`)}
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

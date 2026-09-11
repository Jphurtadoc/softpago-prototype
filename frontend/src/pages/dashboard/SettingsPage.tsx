import { useMemo } from 'react'
import { Box, Tab, Tabs, Typography } from '@mui/material'
import { useSearchParams } from 'react-router-dom'

const SETTINGS_TABS = ['general', 'cuenta'] as const

type SettingsTab = (typeof SETTINGS_TABS)[number]

function resolveSettingsTab(value: string | null): SettingsTab {
  if (value === 'cuenta') return 'cuenta'
  return 'general'
}

/**
 * Settings page with optional `?tab=cuenta` for the account section.
 */
export function SettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = useMemo(
    () => resolveSettingsTab(searchParams.get('tab')),
    [searchParams],
  )

  const handleTabChange = (_event: unknown, nextValue: SettingsTab) => {
    if (nextValue === 'general') {
      setSearchParams({})
      return
    }
    setSearchParams({ tab: nextValue })
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 880 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
        Configuraciones
      </Typography>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        aria-label="Secciones de configuraciones"
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="General" value="general" />
        <Tab label="Cuenta" value="cuenta" />
      </Tabs>

      {activeTab === 'general' && (
        <Box role="tabpanel" aria-label="General">
          <Typography variant="body1" color="text.secondary">
            Ajustes generales de la plataforma.
          </Typography>
        </Box>
      )}

      {activeTab === 'cuenta' && (
        <Box role="tabpanel" aria-label="Cuenta">
          <Typography variant="body1" color="text.secondary">
            Datos de tu cuenta y preferencias personales.
          </Typography>
        </Box>
      )}
    </Box>
  )
}

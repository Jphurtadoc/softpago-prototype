import { Box } from '@mui/material'
import { ChartColumn } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { EmptyState } from '@/shared/components/EmptyState'
import { PageHeader } from '@/shared/components/layouts/PageHeader'

/**
 * Reports dashboard page.
 */
export function ReportsPage() {
  const { t } = useTranslation('reports/dashboard')

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        alignSelf: 'stretch',
        minHeight: 'calc(100dvh - 96px)',
        p: { xs: 2, md: 3 },
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <PageHeader title={t('title')} description={t('subtitle')} />
      <EmptyState
        icon={<ChartColumn size={28} strokeWidth={1.75} />}
        title={t('emptyTitle')}
      />
    </Box>
  )
}

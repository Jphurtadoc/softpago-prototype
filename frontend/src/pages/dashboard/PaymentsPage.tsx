import { Box } from '@mui/material'
import { Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { EmptyState } from '@/shared/components/EmptyState'
import { PageHeader } from '@/shared/components/layouts/PageHeader'

/**
 * Payments dashboard page.
 */
export function PaymentsPage() {
  const { t } = useTranslation('payments/dashboard')

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
        icon={<Wallet size={28} strokeWidth={1.75} />}
        title={t('emptyTitle')}
      />
    </Box>
  )
}

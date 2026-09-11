import type { ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'

export interface PageHeaderProps {
  /** Primary page heading */
  readonly title: ReactNode
  /** Short supporting copy under the title */
  readonly description?: ReactNode
  /** Action controls aligned to the right on `sm+` */
  readonly actions?: ReactNode
}

/**
 * Full-width page header with title, optional description, and right-aligned actions.
 */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <Stack
      component="header"
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      sx={{
        width: '100%',
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
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>

        {description != null && description !== '' ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {description}
          </Typography>
        ) : null}
      </Box>

      {actions != null ? (
        <Box
          sx={{
            display: 'flex',
            flexShrink: 0,
            alignItems: 'center',
            gap: 1,
            width: { xs: '100%', sm: 'auto' },
            justifyContent: { xs: 'flex-start', sm: 'flex-end' },
            flexWrap: 'wrap',
          }}
        >
          {actions}
        </Box>
      ) : null}
    </Stack>
  )
}

export default PageHeader

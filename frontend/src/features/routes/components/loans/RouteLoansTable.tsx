import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material'

import {
  DataTable,
  type DataTableAction,
  type DataTableColumn,
} from '@/shared/components/DataTable'

import type { RouteLoan } from '../../types/routes.types'
import { routesService } from '../../services/routes.service'

interface RouteLoansTableProps {
  routeId: string
  loans: RouteLoan[]
  onChange: () => void
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)

/**
 * Route-scoped loans table using the shared DataTable surface.
 */
export default function RouteLoansTable({
  routeId,
  loans,
  onChange,
}: RouteLoansTableProps) {
  const { t } = useTranslation('routes/details')
  const [editingLoan, setEditingLoan] = useState<RouteLoan | null>(null)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleOpenEdit = (loan: RouteLoan) => {
    setEditingLoan(loan)
    setAmount(String(loan.amount))
    setError('')
  }

  const handleCloseEdit = () => {
    if (loading) {
      return
    }
    setEditingLoan(null)
    setAmount('')
    setError('')
  }

  const handleUpdate = async () => {
    if (!editingLoan) {
      return
    }

    const parsedAmount = Number(amount)

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError(t('loans.amountInvalid'))
      return
    }

    try {
      setLoading(true)
      setError('')
      await routesService.updateLoan(routeId, editingLoan.loanId, {
        amount: parsedAmount,
      })
      setEditingLoan(null)
      setAmount('')
      setError('')
      onChange()
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : t('loans.updateError')
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (loanId: string) => {
    const confirmed = window.confirm(t('loans.confirmRemove'))

    if (!confirmed) {
      return
    }

    try {
      setLoading(true)
      setError('')
      await routesService.removeLoan(routeId, loanId)
      onChange()
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : t('loans.removeError')
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const columns = useMemo<DataTableColumn<RouteLoan>[]>(
    () => [
      {
        key: 'borrower',
        header: t('loans.columns.borrower'),
        render: (loan) => loan.borrowerName,
      },
      {
        key: 'loanId',
        header: t('loans.columns.loanId'),
        render: (loan) => loan.loanId,
      },
      {
        key: 'amount',
        header: t('loans.columns.amount'),
        align: 'right',
        render: (loan) => formatCurrency(loan.amount),
      },
    ],
    [t],
  )

  const actions = useMemo<DataTableAction<RouteLoan>[]>(
    () => [
      {
        id: 'view',
        label: t('loans.view'),
        icon: Eye,
        getHref: (loan) => `/loans/${loan.loanId}`,
      },
      {
        id: 'edit',
        label: t('loans.edit'),
        icon: Pencil,
        onClick: (loan) => handleOpenEdit(loan),
        disabled: () => loading,
      },
      {
        id: 'remove',
        label: t('loans.remove'),
        icon: Trash2,
        danger: true,
        onClick: (loan) => {
          void handleRemove(loan.loanId)
        },
        disabled: () => loading,
      },
    ],
    [loading, t],
  )

  const pagedLoans = useMemo(
    () => loans.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [loans, page, rowsPerPage],
  )

  return (
    <>
      {error ? <Alert severity="error">{error}</Alert> : null}

      <DataTable
        columns={columns}
        data={pagedLoans}
        rowKey={(loan) => loan.loanId}
        emptyMessage={t('loans.emptyTitle')}
        actions={actions}
        actionsAriaLabel={t('loans.actionsMenu')}
        getActionsAriaLabel={(loan) =>
          t('loans.actionsMenuFor', { id: loan.loanId })
        }
        getRowHref={(loan) => `/loans/${loan.loanId}`}
        page={page}
        rowsPerPage={rowsPerPage}
        total={loans.length}
        onPageChange={setPage}
        onRowsPerPageChange={(nextRowsPerPage) => {
          setRowsPerPage(nextRowsPerPage)
          setPage(0)
        }}
        previousPageLabel={t('pagination.prev')}
        nextPageLabel={t('pagination.next')}
        rowsPerPageLabel={t('pagination.rows')}
        rangeLabel={(start, end, totalCount) =>
          t('pagination.range', { start, end, total: totalCount })
        }
        regionLabel={t('sections.loans')}
      />

      <Dialog
        open={Boolean(editingLoan)}
        onClose={handleCloseEdit}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{t('loans.editDialogTitle')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {error ? <Alert severity="error">{error}</Alert> : null}
            <TextField
              label={t('loans.amount')}
              type="number"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              fullWidth
              disabled={loading}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} disabled={loading}>
            {t('loans.cancel')}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => void handleUpdate()}
            disabled={loading}
          >
            {loading ? t('loans.saving') : t('loans.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

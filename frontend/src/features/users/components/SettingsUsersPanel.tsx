import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Eye, Pencil } from 'lucide-react'
import { Alert, Button, Typography } from '@mui/material'
import {
  DataTable,
  DataTableStatusChip,
  type DataTableAction,
  type DataTableColumn,
  type DataTableStatusTab,
  type DataTableTone,
} from '@/shared/components/DataTable'
import { usersService } from '../services/users.service'
import type {
  SystemUser,
  SystemUserRole,
  SystemUserStatus,
} from '../types/users.types'

const ROLE_TONE: Record<SystemUserRole, DataTableTone> = {
  ADMIN: 'brand',
  MANAGER: 'info',
  COLLECTOR: 'success',
  VIEWER: 'neutral',
}

const STATUS_TONE: Record<SystemUserStatus, DataTableTone> = {
  ACTIVE: 'success',
  INACTIVE: 'neutral',
}

/**
 * Builds the avatar initial from a user display name.
 */
function getUserInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || 'U'
}

/**
 * Users list panel for the settings Usuarios tab.
 */
export function SettingsUsersPanel() {
  const { t } = useTranslation('settings/page')
  const [users, setUsers] = useState<SystemUser[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<SystemUserStatus | ''>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(searchInput.trim())
      setPage(0)
    }, 250)
    return () => window.clearTimeout(timeoutId)
  }, [searchInput])

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const response = await usersService.getUsers({
        page: page + 1,
        limit: rowsPerPage,
        search,
        status: statusFilter,
      })
      setUsers(response.data)
      setTotal(response.meta.total)
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : t('users.loadError')
      setError(message)
      setUsers([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [page, rowsPerPage, search, statusFilter, t])

  useEffect(() => {
    void loadUsers()
  }, [loadUsers])

  const columns = useMemo<DataTableColumn<SystemUser>[]>(
    () => [
      {
        key: 'name',
        header: t('users.columns.name'),
        render: (user) => (
          <div className="settings-users__identity">
            <span className="settings-users__avatar" aria-hidden>
              <span className="settings-users__avatar-fallback">
                {getUserInitial(user.name)}
              </span>
            </span>
            <span className="settings-users__name">{user.name}</span>
          </div>
        ),
      },
      {
        key: 'email',
        header: t('users.columns.email'),
        render: (user) => user.email,
      },
      {
        key: 'role',
        header: t('users.columns.role'),
        render: (user) => (
          <DataTableStatusChip
            label={t(`users.roles.${user.role}`)}
            tone={ROLE_TONE[user.role]}
          />
        ),
      },
      {
        key: 'status',
        header: t('users.columns.status'),
        render: (user) => (
          <DataTableStatusChip
            label={t(`users.statuses.${user.status}`)}
            tone={STATUS_TONE[user.status]}
          />
        ),
      },
    ],
    [t],
  )

  const actions = useMemo<DataTableAction<SystemUser>[]>(
    () => [
      {
        id: 'view',
        label: t('users.actions.view'),
        icon: Eye,
        disabled: () => true,
      },
      {
        id: 'edit',
        label: t('users.actions.edit'),
        icon: Pencil,
        disabled: () => true,
      },
    ],
    [t],
  )

  const statusTabs = useMemo<DataTableStatusTab[]>(
    () => [
      { id: 'all', label: t('users.statusTabs.all'), tone: 'neutral' },
      {
        id: 'ACTIVE',
        label: t('users.statuses.ACTIVE'),
        tone: 'success',
      },
      {
        id: 'INACTIVE',
        label: t('users.statuses.INACTIVE'),
        tone: 'neutral',
      },
    ],
    [t],
  )

  const handleStatusTabChange = (tabId: string) => {
    setStatusFilter(tabId === 'all' ? '' : (tabId as SystemUserStatus))
    setPage(0)
  }

  return (
    <section
      id="settings-panel-usuarios"
      className="settings-section"
      role="tabpanel"
      aria-labelledby="settings-tab-usuarios"
    >
      <header className="settings-section__header settings-section__header--with-action">
        <div className="settings-section__header-copy">
          <Typography variant="h6" component="h2" className="settings-section__title">
            {t('users.title')}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            className="settings-section__description"
          >
            {t('users.description')}
          </Typography>
        </div>
        <Button
          type="button"
          variant="contained"
          color="secondary"
          className="settings-section__action"
          startIcon={<Plus size={18} strokeWidth={2.25} aria-hidden />}
          disabled
          aria-disabled="true"
        >
          {t('users.new')}
        </Button>
      </header>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <DataTable
        columns={columns}
        data={users}
        rowKey={(user) => user.id}
        loading={loading}
        emptyMessage={t('users.empty')}
        searchValue={searchInput}
        searchPlaceholder={t('users.searchPlaceholder')}
        onSearchChange={setSearchInput}
        statusTabs={statusTabs}
        activeStatusTab={statusFilter || 'all'}
        onStatusTabChange={handleStatusTabChange}
        statusTabsLabel={t('users.statusTabsLabel')}
        actions={actions}
        actionsAriaLabel={t('users.actions.menu')}
        getActionsAriaLabel={(user) =>
          t('users.actions.menuFor', { name: user.name })
        }
        page={page}
        rowsPerPage={rowsPerPage}
        total={total}
        onPageChange={setPage}
        onRowsPerPageChange={(nextRowsPerPage) => {
          setRowsPerPage(nextRowsPerPage)
          setPage(0)
        }}
        previousPageLabel={t('users.pagination.prev')}
        nextPageLabel={t('users.pagination.next')}
        rowsPerPageLabel={t('users.pagination.rows')}
        rangeLabel={(start, end, totalCount) =>
          t('users.pagination.range', { start, end, total: totalCount })
        }
      />
    </section>
  )
}

import { useMemo, useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  CalendarClock,
  Eye,
  Pencil,
  Percent,
  Trash2,
  Wallet,
} from 'lucide-react';
import { DataTable } from './DataTable';
import { DataTableStatusChip } from './DataTableStatusChip';
import type {
  DataTableAction,
  DataTableColumn,
  DataTableFilter,
  DataTableFilterValues,
  DataTableStatusTab,
} from './data-table.types';

interface DemoLoan {
  id: string;
  borrower: string;
  amount: string;
  frequency: string;
  status: 'active' | 'pending' | 'closed';
}

const DEMO_ROWS: DemoLoan[] = [
  {
    id: 'LN-1001',
    borrower: 'Ana Pérez',
    amount: '$1,200',
    frequency: 'Weekly',
    status: 'active',
  },
  {
    id: 'LN-1002',
    borrower: 'Carlos Ruiz',
    amount: '$850',
    frequency: 'Biweekly',
    status: 'pending',
  },
  {
    id: 'LN-1003',
    borrower: 'María López',
    amount: '$2,400',
    frequency: 'Monthly',
    status: 'active',
  },
  {
    id: 'LN-1004',
    borrower: 'José Díaz',
    amount: '$600',
    frequency: 'Weekly',
    status: 'closed',
  },
  {
    id: 'LN-1005',
    borrower: 'Lucía Gómez',
    amount: '$1,050',
    frequency: 'Monthly',
    status: 'pending',
  },
  {
    id: 'LN-1006',
    borrower: 'Pedro Núñez',
    amount: '$3,100',
    frequency: 'Biweekly',
    status: 'active',
  },
];

const COLUMNS: DataTableColumn<DemoLoan>[] = [
  { key: 'id', header: 'Loan ID', render: (row) => row.id },
  { key: 'borrower', header: 'Borrower', render: (row) => row.borrower },
  { key: 'amount', header: 'Amount', render: (row) => row.amount, align: 'right' },
  { key: 'frequency', header: 'Frequency', render: (row) => row.frequency },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <DataTableStatusChip
        label={row.status}
        tone={
          row.status === 'active'
            ? 'brand'
            : row.status === 'pending'
              ? 'warning'
              : 'neutral'
        }
      />
    ),
  },
];

const FILTERS: DataTableFilter[] = [
  {
    id: 'frequency',
    label: 'Frequency',
    icon: CalendarClock,
    multiple: true,
    options: [
      { value: 'Weekly', label: 'Weekly' },
      { value: 'Biweekly', label: 'Biweekly' },
      { value: 'Monthly', label: 'Monthly' },
    ],
  },
  {
    id: 'amountBand',
    label: 'Amount',
    icon: Wallet,
    multiple: false,
    options: [
      { value: 'low', label: 'Under $1,000' },
      { value: 'mid', label: '$1,000 – $2,000' },
      { value: 'high', label: 'Over $2,000' },
    ],
  },
];

const STATUS_TABS: DataTableStatusTab[] = [
  { id: 'all', label: 'All', count: DEMO_ROWS.length, tone: 'neutral' },
  {
    id: 'active',
    label: 'Active',
    count: DEMO_ROWS.filter((row) => row.status === 'active').length,
    tone: 'brand',
  },
  {
    id: 'pending',
    label: 'Pending',
    count: DEMO_ROWS.filter((row) => row.status === 'pending').length,
    tone: 'warning',
  },
  {
    id: 'closed',
    label: 'Closed',
    count: DEMO_ROWS.filter((row) => row.status === 'closed').length,
    tone: 'neutral',
  },
];

const meta: Meta<typeof DataTable<DemoLoan>> = {
  title: 'Components/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Data table with search, accordion filters, status tabs, multi-select, ' +
          'row overflow actions, and footer pagination. Tokens adapt to light and dark themes.',
      },
    },
  },
  argTypes: {
    theme: {
      control: 'select',
      options: ['light', 'dark'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof DataTable<DemoLoan>>;

/**
 * Interactive playground with client-side filtering for Storybook demos.
 */
function DataTablePlayground({
  theme = 'light',
}: {
  theme?: 'light' | 'dark';
}) {
  const [searchValue, setSearchValue] = useState('');
  const [statusTab, setStatusTab] = useState('all');
  const [filterValues, setFilterValues] = useState<DataTableFilterValues>({
    frequency: [],
    amountBand: '',
  });
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const actions: DataTableAction<DemoLoan>[] = [
    {
      id: 'view',
      label: 'View',
      icon: Eye,
      getHref: (row) => `/loans/${row.id}`,
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: Pencil,
      getHref: (row) => `/loans/${row.id}/edit`,
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      danger: true,
      onClick: fn(),
    },
  ];

  const filtered = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    const frequencyFilter = filterValues.frequency;
    const amountBand = filterValues.amountBand;
    return DEMO_ROWS.filter((row) => {
      if (statusTab !== 'all' && row.status !== statusTab) return false;
      if (
        query &&
        !`${row.id} ${row.borrower}`.toLowerCase().includes(query)
      ) {
        return false;
      }
      if (Array.isArray(frequencyFilter) && frequencyFilter.length > 0) {
        if (!frequencyFilter.includes(row.frequency)) return false;
      }
      if (typeof amountBand === 'string' && amountBand) {
        const numeric = Number(row.amount.replace(/[^0-9.]/g, ''));
        if (amountBand === 'low' && numeric >= 1000) return false;
        if (amountBand === 'mid' && (numeric < 1000 || numeric > 2000)) {
          return false;
        }
        if (amountBand === 'high' && numeric <= 2000) return false;
      }
      return true;
    });
  }, [filterValues, searchValue, statusTab]);

  const paged = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div
      className="app"
      data-theme={theme}
      style={{
        padding: 24,
        background: theme === 'dark' ? '#0d0e12' : '#f7f5f1',
        minHeight: 520,
      }}
    >
      <DataTable
        theme={theme}
        columns={COLUMNS}
        data={paged}
        rowKey={(row) => row.id}
        searchValue={searchValue}
        searchPlaceholder="Search by borrower or Loan ID"
        onSearchChange={(value) => {
          setSearchValue(value);
          setPage(0);
        }}
        filters={FILTERS}
        filterValues={filterValues}
        onFilterChange={(filterId, value) => {
          setFilterValues((current) => ({ ...current, [filterId]: value }));
          setPage(0);
        }}
        onClearFilters={() => {
          setFilterValues({ frequency: [], amountBand: '' });
          setPage(0);
        }}
        statusTabs={STATUS_TABS}
        activeStatusTab={statusTab}
        onStatusTabChange={(tabId) => {
          setStatusTab(tabId);
          setPage(0);
        }}
        selectable
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        actions={actions}
        getRowHref={(row) => `/loans/${row.id}`}
        page={page}
        rowsPerPage={rowsPerPage}
        total={filtered.length}
        onPageChange={setPage}
        onRowsPerPageChange={(next) => {
          setRowsPerPage(next);
          setPage(0);
        }}
      />
    </div>
  );
}

export const Light: Story = {
  render: () => <DataTablePlayground theme="light" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText(/Search by borrower/i)).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: /Filters/i }));
    await expect(canvas.getByRole('group', { name: /Filters/i })).toBeInTheDocument();
  },
};

export const Dark: Story = {
  render: () => <DataTablePlayground theme="dark" />,
};

export const Loading: Story = {
  args: {
    theme: 'light',
    columns: COLUMNS,
    data: [],
    rowKey: (row: DemoLoan) => row.id,
    loading: true,
    selectable: true,
    statusTabs: STATUS_TABS,
    activeStatusTab: 'all',
    page: 0,
    rowsPerPage: 5,
    total: 0,
    onPageChange: fn(),
    onRowsPerPageChange: fn(),
  },
};

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import type { ReactNode } from 'react';

export interface TableColumn<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
}

interface TableComponentProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: (item: T) => string;
  loading?: boolean;
  emptyMessage?: string;
  page: number;
  rowsPerPage: number;
  total: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

export default function TableComponent<T>({
  columns,
  data,
  rowKey,
  loading = false,
  emptyMessage = 'No records found',
  page,
  rowsPerPage,
  total,
  onPageChange,
  onRowsPerPageChange,
}: TableComponentProps<T>) {
  const handlePageChange = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    nextPage: number,
  ) => {
    onPageChange(nextPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    onRowsPerPageChange(Number(event.target.value));
  };

  return (
    <Paper elevation={1}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {column.header}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            )}

            {!loading && data.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              data.map((item) => (
                <TableRow key={rowKey(item)} hover>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render(item)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Paper>
  );
}

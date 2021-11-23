import {
  styled,
  Table,
  TableBody,
  TablePagination,
  TableRow,
} from '@mui/material';
import { ChangeEvent, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PaginatedTableProps } from 'interfaces/table';

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export function PaginatedTable<T>({
  header,
  selectedIndices,
  setSelectedIndices,
  data,
  getRowDetails,
  initialRowsPerPage,
  rowsPerPageOptions,
  className,
}: PaginatedTableProps<T>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const { t } = useTranslation();

  const handleRowClick = (rowIdx: number) => {
    if (selectedIndices.has(rowIdx)) {
      setSelectedIndices((prev) => {
        return new Set(Array.from(prev).filter((x) => x != rowIdx));
      });
    } else {
      setSelectedIndices((prev) => new Set(prev.add(rowIdx)));
    }
  };

  return (
    <>
      <Table className={className}>
        {header}
        <TableBody>
          {data
            .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
            .map((val, idx) => {
              const i = page * rowsPerPage + idx;
              return (
                <Fragment key={i}>
                  {getRowDetails(val, {
                    selected: selectedIndices.has(i),
                    toggleSelected: () => handleRowClick(i),
                  })}
                </Fragment>
              );
            })}
        </TableBody>
      </Table>
      <TablePagination
        count={data.length}
        component="div"
        onPageChange={(_event, newPage) => setPage(newPage)}
        page={page}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        labelRowsPerPage={t('akt.component.table.pagination.rowsPerPage')}
        labelDisplayedRows={({ from, to, count }) =>
          `${from} - ${to} / ${count}`
        }
      />
    </>
  );
}

import {
  styled,
  Table,
  TableBody,
  TablePagination,
  TableRow,
} from '@mui/material';
import { ChangeEvent, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

type SetterType<T> = (val: T) => void;

export interface Selectable {
  selected: boolean;
  toggleSelected(): void;
}

type RowDetailsFn<T> = (details: T, selectionProps: Selectable) => JSX.Element;

interface PaginatedTableProps<T> {
  header?: JSX.Element;
  selectedIndices: Set<number>;
  setSelectedIndices(selected: SetterType<Set<number>> | Set<number>): void;
  data: Array<T>;
  getRowDetails: RowDetailsFn<T>;
}

export function PaginatedTable<T>({
  header,
  selectedIndices,
  setSelectedIndices,
  data,
  getRowDetails,
}: PaginatedTableProps<T>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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

  // TODO Customizable pagination options

  return (
    <>
      <Table>
        {header ? header : null}
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
        rowsPerPageOptions={[10, 20, 50]}
        labelRowsPerPage={t('component.table.pagination.rows_per_page')}
      />
    </>
  );
}

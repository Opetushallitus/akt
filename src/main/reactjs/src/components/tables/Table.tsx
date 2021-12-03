import { Table, TableBody, TablePagination, Chip } from '@mui/material';
import { ChangeEvent, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PaginatedTableProps } from 'interfaces/table';
import { H2 } from 'components/elements/Text';

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
  const { t } = useTranslation();

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setRowsPerPage(+event.target.value);
  };

  const handleRowClick = (rowIdx: number) => {
    if (selectedIndices.has(rowIdx)) {
      setSelectedIndices((prev) => {
        return new Set(Array.from(prev).filter((x) => x != rowIdx));
      });
    } else {
      setSelectedIndices((prev) => new Set(prev.add(rowIdx)));
    }
  };

  const showNumOfSelecteds = () =>
    selectedIndices.size > 0 ? (
      <Chip
        color="secondary"
        variant="outlined"
        className="table__head-box__chip"
        label={`${selectedIndices.size} ${t(
          'akt.component.table.selectedItems'
        )}`}
      />
    ) : (
      <H2>{t('akt.component.table.title')}</H2>
    );

  return (
    <>
      <div className="table__head-box">
        {showNumOfSelecteds()}
        <TablePagination
          className="table__head-box__pagination"
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
      </div>
      <Table className={`${className} table`}>
        {header}
        <TableBody>
          {data
            .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
            .map((val, idx) => {
              const i = page * rowsPerPage + idx;
              return (
                <Fragment key={i}>
                  {getRowDetails(val, t, {
                    selected: selectedIndices.has(i),
                    toggleSelected: () => handleRowClick(i),
                  })}
                </Fragment>
              );
            })}
        </TableBody>
      </Table>
    </>
  );
}

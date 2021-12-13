import { Table, TableBody, TablePagination } from '@mui/material';
import { ChangeEvent, Fragment, useState } from 'react';

import { PaginatedTableProps } from 'interfaces/table';
import { H2 } from 'components/elements/Text';
import { useAppDispatch } from 'configs/redux';
import { useAppTranslation } from 'configs/i18n';

export function PaginatedTable<T>({
  header,
  selectedIndices,
  setSelectedIndices,
  removeSelectedIndices,
  data,
  getRowDetails,
  initialRowsPerPage,
  rowsPerPageOptions,
  className,
}: PaginatedTableProps<T>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const dispatch = useAppDispatch();
  const { t } = useAppTranslation({ keyPrefix: 'akt.component' });

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setRowsPerPage(+event.target.value);
  };

  const handleRowClick = (index: number) => {
    if (selectedIndices.includes(index)) {
      dispatch(removeSelectedIndices(index));
    } else {
      dispatch(setSelectedIndices(index));
    }
  };

  const showNumOfSelected = () =>
    selectedIndices.length > 0 ? (
      <H2>{`${selectedIndices.length} ${t('table.selectedItems')}`}</H2>
    ) : (
      <H2>{t('table.title')}</H2>
    );

  return (
    <>
      <div className="table__head-box">
        {showNumOfSelected()}
        <TablePagination
          className="table__head-box__pagination"
          count={data.length}
          component="div"
          onPageChange={(_event, newPage) => setPage(newPage)}
          page={page}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
          labelRowsPerPage={t('table.pagination.rowsPerPage')}
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
            .map((val, index) => {
              const i = page * rowsPerPage + index;
              return (
                <Fragment key={i}>
                  {getRowDetails(val, t, {
                    selected: selectedIndices.includes(index),
                    toggleSelected: () => handleRowClick(index),
                  })}
                </Fragment>
              );
            })}
        </TableBody>
      </Table>
    </>
  );
}

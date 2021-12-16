import { Table, TableBody, TablePagination } from '@mui/material';
import { ChangeEvent, Fragment, useState } from 'react';

import { PaginatedTableProps } from 'interfaces/table';
import { H2 } from 'components/elements/Text';
import { useAppDispatch } from 'configs/redux';
import { useAppTranslation } from 'configs/i18n';
import { WithId } from 'interfaces/withId';

export function PaginatedTable<T extends WithId>({
  header,
  selectedIndices,
  addSelectedIndex,
  removeSelectedIndex,
  data,
  getRowDetails,
  initialRowsPerPage,
  rowsPerPageOptions,
  className,
  callToAction,
}: PaginatedTableProps<T>): JSX.Element {
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
      dispatch(removeSelectedIndex(index));
    } else {
      dispatch(addSelectedIndex(index));
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
        <div className="rows">
          <div className="columns">
            <div className="grow">{showNumOfSelected()}</div>
            {callToAction}
          </div>
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
      </div>
      <Table className={`${className} table`}>
        {header}
        <TableBody>
          {data
            .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
            .map((val) => {
              const id = val.id;
              return (
                <Fragment key={id}>
                  {getRowDetails(val, t, {
                    selected: selectedIndices.includes(id),
                    toggleSelected: () => handleRowClick(id),
                  })}
                </Fragment>
              );
            })}
        </TableBody>
      </Table>
    </>
  );
}

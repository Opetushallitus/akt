import {
  LabelDisplayedRowsArgs,
  Table,
  TableBody,
  TablePagination,
} from '@mui/material';
import { ChangeEvent, Fragment, useEffect, useState } from 'react';

import { useAppTranslation } from 'configs/i18n';
import { useAppDispatch } from 'configs/redux';
import { PaginatedTableProps } from 'interfaces/table';
import { WithId } from 'interfaces/withId';

const PaginationDisplayedRowsLabel = ({
  from,
  to,
  count,
}: LabelDisplayedRowsArgs) => {
  return `${from} - ${to} / ${count}`;
};

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
}: PaginatedTableProps<T>): JSX.Element {
  const dispatch = useAppDispatch();
  const { t } = useAppTranslation({ keyPrefix: 'akt.component' });

  const handleRowClick = (index: number) => {
    if (selectedIndices.includes(index)) {
      dispatch(removeSelectedIndex(index));
    } else {
      dispatch(addSelectedIndex(index));
    }
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [count, setCount] = useState(data.length);
  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setRowsPerPage(+event.target.value);
  };
  // Reset page count if underlying data (as measured by number of elements) changes
  useEffect(() => {
    if (count != data.length) {
      setCount(data.length);
      setPage(0);
    }
  }, [data, count]);

  return (
    <>
      <div className="table__head-box">
        <TablePagination
          className="table__head-box__pagination"
          count={count}
          component="div"
          onPageChange={(_event, newPage) => setPage(newPage)}
          page={page}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
          labelRowsPerPage={t('table.pagination.rowsPerPage')}
          labelDisplayedRows={PaginationDisplayedRowsLabel}
        />
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
                  {getRowDetails(val, selectedIndices.includes(id), () =>
                    handleRowClick(id)
                  )}
                </Fragment>
              );
            })}
        </TableBody>
      </Table>
    </>
  );
}

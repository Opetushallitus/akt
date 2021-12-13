import { TFunction } from 'i18next';
import { Action } from 'redux';

import { Selectable } from 'interfaces/selectable';

type RowDetailsFn<T> = (
  details: T,
  t: TFunction,
  selectionProps: Selectable
) => JSX.Element;

export interface PaginatedTableProps<T> {
  header?: JSX.Element;
  selectedIndices: Array<number>;
  addSelectedIndex(index: number): Action<string>;
  removeSelectedIndex(index: number): Action<string>;
  data: Array<T>;
  getRowDetails: RowDetailsFn<T>;
  initialRowsPerPage: number;
  rowsPerPageOptions: Array<number | { value: number; label: string }>;
  className: string;
}

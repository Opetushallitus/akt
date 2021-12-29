import { TFunction } from 'i18next';
import { Action } from 'redux';

import { Selectable } from 'interfaces/selectable';
import { WithId } from 'interfaces/withId';

export type RowDetailsFn<T> = (
  details: T,
  t: TFunction,
  selectionProps: Selectable
) => JSX.Element;

export interface PaginatedTableProps<T extends WithId> {
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

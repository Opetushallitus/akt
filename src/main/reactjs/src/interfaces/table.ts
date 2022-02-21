import { Action } from 'redux';

import { WithId } from 'interfaces/withId';

export type RowDetailsFn<T> = (
  details: T,
  selected: boolean,
  toggleSelected: () => void
) => JSX.Element;

export interface PaginatedTableProps<T extends WithId> {
  header?: JSX.Element;
  selectedIndices?: Array<number>;
  addSelectedIndex(index: number): Action<string> | undefined;
  removeSelectedIndex(index: number): Action<string> | undefined;
  data: Array<T>;
  getRowDetails: RowDetailsFn<T>;
  initialRowsPerPage: number;
  rowsPerPageOptions: Array<number | { value: number; label: string }>;
  className: string;
  stickyHeader?: boolean;
}

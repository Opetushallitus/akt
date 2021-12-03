import { TFunction } from 'i18next';

import { Selectable } from 'interfaces/selectable';

type SetterType<T> = (val: T) => void;

type RowDetailsFn<T> = (
  details: T,
  t: TFunction,
  selectionProps: Selectable
) => JSX.Element;

export interface PaginatedTableProps<T> {
  header?: JSX.Element;
  selectedIndices: Set<number>;
  setSelectedIndices(selected: SetterType<Set<number>> | Set<number>): void;
  data: Array<T>;
  getRowDetails: RowDetailsFn<T>;
  initialRowsPerPage: number;
  rowsPerPageOptions: Array<number | { value: number; label: string }>;
  className: string;
}

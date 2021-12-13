import { TFunction } from 'i18next';

import { Selectable } from 'interfaces/selectable';
import { TranslatorDetailsAction } from 'interfaces/translator';

type RowDetailsFn<T> = (
  details: T,
  t: TFunction,
  selectionProps: Selectable
) => JSX.Element;

export interface PaginatedTableProps<T> {
  header?: JSX.Element;
  selectedIndices: Array<number>;
  setSelectedIndices(index: number): TranslatorDetailsAction;
  removeSelectedIndices(index: number): TranslatorDetailsAction;
  data: Array<T>;
  getRowDetails: RowDetailsFn<T>;
  initialRowsPerPage: number;
  rowsPerPageOptions: Array<number | { value: number; label: string }>;
  className: string;
}

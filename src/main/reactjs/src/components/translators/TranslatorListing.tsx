import { TableCell, Checkbox, TableHead, TableRow } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { H3, Text } from 'components/elements/Text';
import { TranslatorDetails } from 'interfaces/translator';
import { PaginatedTable, StyledTableRow } from '../tables/Table';
import { Selectable } from 'interfaces/selectable';

const translatorDetailsRow = (
  translator: TranslatorDetails,
  selectionProps: Selectable
) => {
  const { name, languagePairs, hometown } = translator;
  const { selected, toggleSelected } = selectionProps;
  return (
    <StyledTableRow selected={selected} onClick={toggleSelected}>
      <TableCell padding="checkbox">
        <Checkbox
          className="translator-listing__checkbox"
          checked={selected}
          color="secondary"
        />
      </TableCell>
      <TableCell>
        {languagePairs.map(({ from, to }, j) => (
          <Text key={j}>
            {from} - {to}
          </Text>
        ))}
      </TableCell>
      <TableCell>
        <Text>{name}</Text>
      </TableCell>
      <TableCell>
        <Text>{hometown}</Text>
      </TableCell>
    </StyledTableRow>
  );
};

const ListingHeader = ({
  selectedItems,
  totalItems,
  toggleAllSelected,
}: {
  selectedItems: number;
  totalItems: number;
  toggleAllSelected(selected: boolean): void;
}) => {
  const { t } = useTranslation();

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selectedItems == totalItems}
            indeterminate={selectedItems > 0 && selectedItems < totalItems}
            onChange={(event) => toggleAllSelected(event.target.checked)}
            color="secondary"
            className="translator-listing__checkbox"
          ></Checkbox>
        </TableCell>
        <TableCell>
          <H3>{t('akt.pages.translator.languagePairs')}</H3>
        </TableCell>
        <TableCell>
          <H3>{t('akt.pages.translator.name')}</H3>
        </TableCell>
        <TableCell>
          <H3>{t('akt.pages.translator.hometown')}</H3>
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export const TranslatorListing = ({
  translators,
}: {
  translators: Array<TranslatorDetails>;
}) => {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const toggleAllSelected = (allSelected: boolean) => {
    if (allSelected) {
      setSelected(new Set(Array.from(new Array(translators.length).keys())));
    } else {
      setSelected(new Set());
    }
  };
  return (
    <PaginatedTable
      className="translator-listing"
      selectedIndices={selected}
      setSelectedIndices={setSelected}
      data={translators}
      getRowDetails={translatorDetailsRow}
      header={
        <ListingHeader
          selectedItems={selected.size}
          totalItems={translators.length}
          toggleAllSelected={toggleAllSelected}
        />
      }
      initialRowsPerPage={10}
      rowsPerPageOptions={[10, 20, 50]}
    />
  );
};

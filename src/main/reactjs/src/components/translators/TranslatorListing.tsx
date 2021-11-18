import { TableCell, Checkbox, TableHead, TableRow } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { H3, Text } from 'components/elements/Text';
import { TranslatorDetails } from 'interfaces/translator';
import { PaginatedTable, Selectable, StyledTableRow } from '../tables/Table';

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
          ></Checkbox>
        </TableCell>
        <TableCell>
          <H3>{t('akt.translator.name')}</H3>
        </TableCell>
        <TableCell>
          <H3>{t('akt.translator.languagePairs')}</H3>
        </TableCell>
        <TableCell>
          <H3>{t('akt.translator.hometown')}</H3>
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

  const translatorDetailsRow = (
    { name, languagePairs, hometown }: TranslatorDetails,
    { selected, toggleSelected }: Selectable
  ) => {
    return (
      <StyledTableRow selected={selected} onClick={toggleSelected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} />
        </TableCell>
        <TableCell>
          <Text>{name}</Text>
        </TableCell>
        <TableCell>
          {languagePairs.map(({ from, to }, j) => (
            <Text key={j}>
              {from} - {to}
            </Text>
          ))}
        </TableCell>
        <TableCell>
          <Text>{hometown}</Text>
        </TableCell>
      </StyledTableRow>
    );
  };

  const toggleAllSelected = (allSelected: boolean) => {
    if (allSelected) {
      setSelected(new Set(Array.from(new Array(translators.length).keys())));
    } else {
      setSelected(new Set());
    }
  };
  return (
    <PaginatedTable
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

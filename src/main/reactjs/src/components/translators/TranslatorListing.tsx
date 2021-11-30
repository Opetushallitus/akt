import { TableCell, Checkbox, TableHead, TableRow } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { H3, Text } from 'components/elements/Text';
import { PaginatedTable } from 'components/tables/Table';
import { TranslatorDetails } from 'interfaces/translator';
import { Selectable } from 'interfaces/selectable';

const translatorDetailsRow = (
  translator: TranslatorDetails,
  selectionProps: Selectable
) => {
  const { name, languagePairs, hometown } = translator;
  const { selected, toggleSelected } = selectionProps;
  return (
    <TableRow selected={selected} onClick={toggleSelected}>
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
    </TableRow>
  );
};

const ListingHeader = () => {
  const { t } = useTranslation();

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
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

  return (
    <PaginatedTable
      className="translator-listing"
      selectedIndices={selected}
      setSelectedIndices={setSelected}
      data={translators}
      getRowDetails={translatorDetailsRow}
      header={<ListingHeader />}
      initialRowsPerPage={10}
      rowsPerPageOptions={[10, 20, 50]}
    />
  );
};

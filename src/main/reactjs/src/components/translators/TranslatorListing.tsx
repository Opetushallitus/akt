import { TableCell, Checkbox, TableHead, TableRow } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/system';

import { H3, Text } from 'components/elements/Text';
import { PaginatedTable } from 'components/tables/Table';
import { TranslatorDetails } from 'interfaces/translator';
import { Selectable } from 'interfaces/selectable';
import { ProgressIndicator } from 'components/elements/ProgressIndicator';
import { ApiResponseStatus } from 'enums/api';

const translatorDetailsRow = (
  translator: TranslatorDetails,
  selectionProps: Selectable
) => {
  const { name, languagePairs, town } = translator;
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
        <Text>{town}</Text>
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
  status,
  translators,
}: {
  status: ApiResponseStatus;
  translators: Array<TranslatorDetails>;
}) => {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const { t } = useTranslation();
  switch (status) {
    case ApiResponseStatus.NotLoaded:
    case ApiResponseStatus.Loading:
      return (
        <Box
          minHeight="10vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <ProgressIndicator />
        </Box>
      );
    case ApiResponseStatus.Error:
      return (
        <Box
          minHeight="10vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <H3>{t('akt.errors.loadingFailed')}</H3>
        </Box>
      );
    case ApiResponseStatus.Loaded:
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
  }
};

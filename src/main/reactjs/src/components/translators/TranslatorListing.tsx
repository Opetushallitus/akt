import { FC, useState } from 'react';
import { TableCell, Checkbox, TableHead, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { Box } from '@mui/system';

import { H3, Text } from 'components/elements/Text';
import { PaginatedTable } from 'components/tables/Table';
import { TranslatorDetails } from 'interfaces/translator';
import { Selectable } from 'interfaces/selectable';
import { ProgressIndicator } from 'components/elements/ProgressIndicator';
import { APIResponseStatus } from 'enums/api';

const getTranslatorDetailsRow = (
  translator: TranslatorDetails,
  t: TFunction,
  selectionProps: Selectable
) => {
  const { firstName, lastName, languagePairs, town } = translator;
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
        <Text>{`${lastName} ${firstName}`}</Text>
      </TableCell>
      <TableCell>
        {languagePairs.map(({ from, to }, k) => (
          <Text key={k}>
            {t(`akt.pages.translator.languages.${from}`)}
            {` - `}
            {t(`akt.pages.translator.languages.${to}`)}
          </Text>
        ))}
      </TableCell>
      <TableCell>
        <Text>{town}</Text>
      </TableCell>
    </TableRow>
  );
};

const ListingHeader: FC = () => {
  const { t } = useTranslation();

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
        <TableCell>
          <H3>{t('akt.pages.translator.name')}</H3>
        </TableCell>
        <TableCell>
          <H3>{t('akt.pages.translator.languagePairs')}</H3>
        </TableCell>
        <TableCell>
          <H3>{t('akt.pages.translator.town')}</H3>
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export const TranslatorListing = ({
  status,
  translators,
}: {
  status: APIResponseStatus;
  translators: Array<TranslatorDetails>;
}) => {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const { t } = useTranslation();

  switch (status) {
    case APIResponseStatus.NotLoaded:
    case APIResponseStatus.Loading:
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
    case APIResponseStatus.Error:
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
    case APIResponseStatus.Loaded:
      return (
        <PaginatedTable
          className="translator-listing"
          selectedIndices={selected}
          addSelectedIndex={setSelected}
          data={translators}
          getRowDetails={getTranslatorDetailsRow}
          header={<ListingHeader />}
          initialRowsPerPage={10}
          rowsPerPageOptions={[10, 20, 50]}
        />
      );
  }
};

import { FC } from 'react';
import {
  TableCell,
  Checkbox,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import { TFunction } from 'i18next';
import { Box } from '@mui/system';

import { H2, H3, Text } from 'components/elements/Text';
import { PaginatedTable } from 'components/tables/Table';
import { ProgressIndicator } from 'components/elements/ProgressIndicator';
import { TranslatorDetails } from 'interfaces/translator';
import { Selectable } from 'interfaces/selectable';
import { APIResponseStatus } from 'enums/api';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { useAppTranslation } from 'configs/i18n';
import {
  addSelectedTranslator,
  removeSelectedTranslator,
} from 'redux/actions/translatorDetails';
import { publicTranslatorsSelector } from 'redux/selectors/translatorDetails';
import { UIStates } from 'enums/app';
import { displayUIState } from 'redux/actions/navigation';

const getTranslatorDetailsRow = (
  translator: TranslatorDetails,
  t: TFunction,
  selectionProps: Selectable
) => {
  const { firstName, lastName, languagePairs, town, country } = translator;
  const { selected, toggleSelected } = selectionProps;
  const townInfo = `${town}${country ? `, ${country}` : ''}`;

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
            {t(`publicTranslatorFilters.languages.${from}`)}
            {` - `}
            {t(`publicTranslatorFilters.languages.${to}`)}
          </Text>
        ))}
      </TableCell>
      <TableCell>
        <Text>{townInfo}</Text>
      </TableCell>
    </TableRow>
  );
};

const ListingHeader: FC = () => {
  const { t } = useAppTranslation({ keyPrefix: 'akt.pages.translator' });

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
        <TableCell>
          <H3>{t('name')}</H3>
        </TableCell>
        <TableCell>
          <H3>{t('languagePairs')}</H3>
        </TableCell>
        <TableCell>
          <H3>{t('town')}</H3>
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

const ContactRequestButton = () => {
  const { selectedTranslators } = useAppSelector(publicTranslatorsSelector);
  const { t } = useAppTranslation({ keyPrefix: 'akt.pages.homepage' });
  const dispatch = useAppDispatch();
  return (
    <Button
      color="secondary"
      variant="contained"
      onClick={() => dispatch(displayUIState(UIStates.ContactRequest))}
      disabled={selectedTranslators.length == 0}
    >
      {t('requestContact')}
    </Button>
  );
};

const SelectedTranslatorsHeading = () => {
  const { selectedTranslators: selectedIndices } = useAppSelector(
    publicTranslatorsSelector
  );

  const { t } = useAppTranslation({ keyPrefix: 'akt.component.table' });

  return selectedIndices.length > 0 ? (
    <H2>{`${selectedIndices.length} ${t('selectedItems')}`}</H2>
  ) : (
    <H2>{t('title')}</H2>
  );
};

export const TranslatorListing = ({
  status,
  translators,
}: {
  status: APIResponseStatus;
  translators: Array<TranslatorDetails>;
}) => {
  const { t } = useAppTranslation({ keyPrefix: 'akt' });
  const { selectedTranslators } = useAppSelector(publicTranslatorsSelector);

  switch (status) {
    case APIResponseStatus.NotStarted:
    case APIResponseStatus.InProgress:
      return <ProgressIndicator color="secondary" />;
    case APIResponseStatus.Error:
      return (
        <Box
          minHeight="10vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <H3>{t('errors.loadingFailed')}</H3>
        </Box>
      );
    case APIResponseStatus.Success:
      return (
        <>
          <div className="columns">
            <div className="grow">
              <SelectedTranslatorsHeading />
            </div>
            <ContactRequestButton />
          </div>
          <PaginatedTable
            className="translator-listing"
            selectedIndices={selectedTranslators}
            addSelectedIndex={addSelectedTranslator}
            removeSelectedIndex={removeSelectedTranslator}
            data={translators}
            getRowDetails={getTranslatorDetailsRow}
            header={<ListingHeader />}
            initialRowsPerPage={10}
            rowsPerPageOptions={[10, 20, 50]}
          />
        </>
      );
  }
};

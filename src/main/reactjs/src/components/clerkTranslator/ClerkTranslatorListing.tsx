import { TableRow, TableCell, Checkbox, TableHead } from '@mui/material';
import { Box } from '@mui/system';
import { TFunction } from 'i18next';
import { FC } from 'react';

import { ProgressIndicator } from 'components/elements/ProgressIndicator';
import { Text, H3 } from 'components/elements/Text';
import { PaginatedTable } from 'components/tables/Table';
import { useAppTranslation } from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { APIResponseStatus } from 'enums/api';
import { ClerkTranslator } from 'interfaces/clerkTranslator';
import { Selectable } from 'interfaces/selectable';
import {
  deselectAllTranslators,
  deselectClerkTranslator,
  selectAllFilteredTranslators,
  selectClerkTranslator,
} from 'redux/actions/clerkTranslator';
import {
  clerkTranslatorsSelector,
  selectFilteredClerkTranslators,
  selectFilteredSelectedIds,
} from 'redux/selectors/clerkTranslator';

const getLanguagePairsWithAuthorisations = (translator: ClerkTranslator) => {
  return translator.authorisations.flatMap(({ basis, term, languagePairs }) =>
    languagePairs.map(({ from, to, permissionToPublish }) => ({
      from,
      to,
      permissionToPublish,
      authorisationBasis: basis,
      authorisationStart: term?.start,
      authorisationEnd: term?.end,
    }))
  );
};

const dateFormatter = new Intl.DateTimeFormat();
const formatDate = (date?: Date) => {
  if (!date) {
    return '-';
  }

  return dateFormatter.format(date);
};

const getClerkTranslatorRow = (
  translator: ClerkTranslator,
  t: TFunction,
  selectionProps: Selectable
) => {
  const { selected, toggleSelected } = selectionProps;
  const { firstName, lastName } = translator.contactDetails;
  const languagesWithAuthorisations =
    getLanguagePairsWithAuthorisations(translator);

  return (
    <TableRow
      data-testid={`clerk-translators__id-${translator.id}-row`}
      selected={selected}
      onClick={toggleSelected}
    >
      <TableCell padding="checkbox">
        <Checkbox checked={selected} color="secondary" />
      </TableCell>
      <TableCell>{`${firstName} ${lastName}`}</TableCell>
      <TableCell>
        <div className="rows">
          {languagesWithAuthorisations.map(({ from, to }, idx) => (
            <Text key={idx}>
              {`${t(`publicTranslatorFilters.languages.${from}`)} - ${t(
                `publicTranslatorFilters.languages.${to}`
              )}`}
            </Text>
          ))}
        </div>
      </TableCell>
      <TableCell>
        <div className="rows">
          {languagesWithAuthorisations.map(({ authorisationBasis }, idx) => (
            <Text key={idx}>{authorisationBasis}</Text>
          ))}
        </div>
      </TableCell>
      <TableCell>
        <div className="rows">
          {languagesWithAuthorisations.map(({ authorisationStart }, idx) => (
            <Text key={idx}>{formatDate(authorisationStart)}</Text>
          ))}
        </div>
      </TableCell>
      <TableCell>
        <div className="rows">
          {languagesWithAuthorisations.map(({ authorisationEnd }, idx) => (
            <Text key={idx}>{formatDate(authorisationEnd)}</Text>
          ))}
        </div>
      </TableCell>
      <TableCell>
        <div className="rows">
          {languagesWithAuthorisations.map(({ permissionToPublish }, idx) => (
            <Text key={idx}>
              {t(
                `clerkTranslatorListing.permissionToPublish.${permissionToPublish}`
              )}
            </Text>
          ))}
        </div>
      </TableCell>
    </TableRow>
  );
};

const ListingHeader: FC = () => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.clerkTranslatorListing.header',
  });

  const dispatch = useAppDispatch();
  const filteredCount = useAppSelector(selectFilteredClerkTranslators).length;
  const selectedCount = useAppSelector(selectFilteredSelectedIds).length;
  const allSelected = filteredCount > 0 && filteredCount === selectedCount;
  const indeterminate = selectedCount > 0 && selectedCount < filteredCount;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="secondary"
            checked={allSelected}
            indeterminate={indeterminate}
            onClick={() => {
              if (allSelected) {
                dispatch(deselectAllTranslators);
              } else {
                dispatch(selectAllFilteredTranslators);
              }
            }}
          />
        </TableCell>
        <TableCell>
          <H3>{t('name')}</H3>
        </TableCell>
        <TableCell>
          <H3>{t('languagePairs')}</H3>
        </TableCell>
        <TableCell>
          <H3>{t('authorisationBasis')}</H3>
        </TableCell>
        <TableCell>
          <H3>{t('authorisationBeginDate')}</H3>
        </TableCell>
        <TableCell>
          <H3>{t('authorisationEndDate')}</H3>
        </TableCell>
        <TableCell>
          <H3>{t('permissionToPublish')}</H3>
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export const ClerkTranslatorListing: FC = () => {
  const { t } = useAppTranslation({ keyPrefix: 'akt' });
  const { status } = useAppSelector(clerkTranslatorsSelector);
  const filteredTranslators = useAppSelector(selectFilteredClerkTranslators);
  const filteredSelectedIds = useAppSelector(selectFilteredSelectedIds);

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
        <PaginatedTable
          selectedIndices={filteredSelectedIds}
          addSelectedIndex={selectClerkTranslator}
          removeSelectedIndex={deselectClerkTranslator}
          data={filteredTranslators}
          header={<ListingHeader />}
          getRowDetails={getClerkTranslatorRow}
          initialRowsPerPage={10}
          rowsPerPageOptions={[10, 20, 50]}
          className={'clerk-translator__listing'}
        />
      );
  }
};

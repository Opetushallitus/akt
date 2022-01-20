import { TableRow, TableCell, Checkbox, TableHead } from '@mui/material';
import { Box } from '@mui/system';
import { FC } from 'react';

import { ProgressIndicator } from 'components/elements/ProgressIndicator';
import { Text, H3 } from 'components/elements/Text';
import { PaginatedTable } from 'components/tables/Table';
import {
  useAppTranslation,
  useKoodistoLanguagesTranslation,
} from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { APIResponseStatus } from 'enums/api';
import { Color } from 'enums/app';
import { ClerkTranslator } from 'interfaces/clerkTranslator';
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
import { DateUtils } from 'utils/date';

const getRowDetails = (
  translator: ClerkTranslator,
  selected: boolean,
  toggleSelected: () => void
) => {
  return (
    <ListingRow
      translator={translator}
      selected={selected}
      toggleSelected={toggleSelected}
    />
  );
};

const ListingRow = ({
  translator,
  selected,
  toggleSelected,
}: {
  translator: ClerkTranslator;
  selected: boolean;
  toggleSelected: () => void;
}) => {
  // I18n
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.clerkTranslatorListing',
  });
  const { firstName, lastName } = translator.contactDetails;
  const authorisations = translator.authorisations;
  const translateLanguage = useKoodistoLanguagesTranslation();

  return (
    <TableRow
      data-testid={`clerk-translators__id-${translator.id}-row`}
      selected={selected}
      onClick={toggleSelected}
    >
      <TableCell padding="checkbox">
        <Checkbox checked={selected} color={Color.Secondary} />
      </TableCell>
      <TableCell>
        <Text>{`${firstName} ${lastName}`}</Text>
      </TableCell>
      <TableCell>
        <div className="rows">
          {authorisations.map(({ languagePair: { from, to } }, idx) => (
            <Text key={idx}>
              {`${translateLanguage(from)} - ${translateLanguage(to)}`}
            </Text>
          ))}
        </div>
      </TableCell>
      <TableCell>
        <div className="rows">
          {authorisations.map(({ basis }, idx) => (
            <Text key={idx}>{basis}</Text>
          ))}
        </div>
      </TableCell>
      <TableCell>
        <div className="rows">
          {authorisations.map(({ effectiveTerm }, idx) => (
            <Text key={idx}>
              {DateUtils.formatOptionalDate(effectiveTerm?.start)}
            </Text>
          ))}
        </div>
      </TableCell>
      <TableCell>
        <div className="rows">
          {authorisations.map(({ effectiveTerm }, idx) => (
            <Text key={idx}>
              {DateUtils.formatOptionalDate(effectiveTerm?.end)}
            </Text>
          ))}
        </div>
      </TableCell>
      <TableCell>
        <div className="rows">
          {authorisations.map(({ permissionToPublish }, idx) => (
            <Text key={idx}>
              {t(`permissionToPublish.${permissionToPublish}`)}
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
  const onCheckboxClick = () => {
    if (allSelected) {
      dispatch(deselectAllTranslators);
    } else {
      dispatch(selectAllFilteredTranslators);
    }
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color={Color.Secondary}
            checked={allSelected}
            indeterminate={indeterminate}
            onClick={onCheckboxClick}
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
      return <ProgressIndicator color={Color.Secondary} />;
    case APIResponseStatus.Cancelled:
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
          getRowDetails={getRowDetails}
          initialRowsPerPage={10}
          rowsPerPageOptions={[10, 20, 50]}
          className={'clerk-translator__listing'}
        />
      );
  }
};

import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import {
  Button,
  Checkbox,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { Box } from '@mui/system';
import { FC } from 'react';
import { Link } from 'react-router-dom';

import { H2, H3, Text } from 'components/elements/Text';
import { PaginatedTable } from 'components/tables/Table';
import {
  useAppTranslation,
  useKoodistoLanguagesTranslation,
} from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { APIResponseStatus } from 'enums/api';
import { AppRoutes, Color } from 'enums/app';
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
import { AuthorisationUtils } from 'utils/authorisation';
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

const translatorDetailsURL = (id: number) =>
  AppRoutes.ClerkTranslatorOverviewPage.replace(/:translatorId$/, `${id}`);

const stopOnClickPropagation = (
  e: React.MouseEvent<HTMLAnchorElement> | undefined
) => {
  e?.stopPropagation();
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
  const { firstName, lastName } = translator;
  const authorisations = translator.authorisations;
  const translateLanguage = useKoodistoLanguagesTranslation();
  const currentDate = new Date();

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
        <Text>{`${lastName} ${firstName}`}</Text>
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
          {authorisations.map((a, idx) => (
            <Text key={idx}>
              {AuthorisationUtils.isAuthorisationValid(a, currentDate)
                ? t('values.yes')
                : t('values.no')}
            </Text>
          ))}
        </div>
      </TableCell>
      <TableCell>
        <div className="rows">
          {authorisations.map(({ permissionToPublish }, idx) => (
            <Text key={idx}>
              {permissionToPublish ? t('values.yes') : t('values.no')}
            </Text>
          ))}
        </div>
      </TableCell>
      <TableCell>
        <div className="columns gapped-sm">
          <Button
            data-testid={`clerk-translators__id-${translator.id}-more-btn`}
            to={translatorDetailsURL(translator.id)}
            component={Link}
            color={Color.Secondary}
            onClick={stopOnClickPropagation}
            endIcon={<ArrowForwardIosOutlinedIcon />}
          >
            {t('detailsButton')}
          </Button>
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
          <H3>{t('valid')}</H3>
        </TableCell>
        <TableCell>
          <H3>{t('permissionToPublish')}</H3>
        </TableCell>
        <TableCell />
      </TableRow>
    </TableHead>
  );
};

export const ClerkTranslatorListing: FC = () => {
  const { t } = useAppTranslation({ keyPrefix: 'akt' });
  const { status } = useAppSelector(clerkTranslatorsSelector);
  const filteredTranslators = useAppSelector(selectFilteredClerkTranslators);
  const filteredSelectedIds = useAppSelector(selectFilteredSelectedIds);
  const selected = filteredSelectedIds.length;

  switch (status) {
    case APIResponseStatus.NotStarted:
    case APIResponseStatus.InProgress:
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
        <>
          <div className="grow">
            {selected > 0 && (
              <H2 data-testid="public-translators__selected-count-heading">
                {`${selected} ${t('component.table.selectedItems')}`}
              </H2>
            )}
          </div>
          <PaginatedTable
            selectedIndices={filteredSelectedIds}
            addSelectedIndex={selectClerkTranslator}
            removeSelectedIndex={deselectClerkTranslator}
            data={filteredTranslators}
            header={<ListingHeader />}
            getRowDetails={getRowDetails}
            initialRowsPerPage={10}
            rowsPerPageOptions={[10, 20, 50]}
            className={'clerk-translator__listing table-layout-auto'}
            stickyHeader
          />
        </>
      );
  }
};

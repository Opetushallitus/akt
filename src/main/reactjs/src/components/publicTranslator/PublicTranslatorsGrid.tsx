import { Grid, Paper, Skeleton } from '@mui/material';
import { useState } from 'react';

import { HeaderSeparator } from 'components/elements/HeaderSeparator';
import { H1, H2, Text } from 'components/elements/Text';
import { PublicTranslatorFilters } from 'components/publicTranslator/PublicTranslatorFilters';
import { PublicTranslatorListing } from 'components/publicTranslator/PublicTranslatorListing';
import { useAppTranslation } from 'configs/i18n';
import { useAppSelector } from 'configs/redux';
import { APIResponseStatus } from 'enums/api';
import { SkeletonVariant } from 'enums/app';
import {
  publicTranslatorsSelector,
  selectFilteredPublicTranslators,
} from 'redux/selectors/publicTranslator';

export const PublicTranslatorsGrid = () => {
  // I18
  const { t } = useAppTranslation({ keyPrefix: 'akt.pages.homepage' });
  // Redux
  const { status } = useAppSelector(publicTranslatorsSelector);
  const translators = useAppSelector(selectFilteredPublicTranslators);
  // State
  const [showTable, setShowTable] = useState(false);
  const hasResults = translators.length > 0 && showTable;
  const hasNoResults = !hasResults && showTable;
  const isLoading = status === APIResponseStatus.InProgress;

  const renderSkeletons = () => (
    <>
      <Skeleton variant={SkeletonVariant.Text}>
        <H1 className="public-homepage__filters__heading-title">
          {t('filters.title')}
        </H1>
      </Skeleton>
      <Skeleton className="full-max-width" variant={SkeletonVariant.Text}>
        <Text className="public-homepage__filters__heading-description">
          {t('note')}
        </Text>
      </Skeleton>
      <Skeleton
        className="full-max-width"
        variant={SkeletonVariant.Rectangular}
      >
        <PublicTranslatorFilters setShowTable={setShowTable} />
      </Skeleton>
    </>
  );

  return (
    <>
      <Grid item className="public-homepage__grid-container__item-header">
        <H1 data-testid="public-homepage__title-heading">{t('title')}</H1>
        <HeaderSeparator />
        <Text>{t('description')}</Text>
      </Grid>
      <Grid item className="public-homepage__grid-container__item-filters">
        <Paper elevation={3} className="public-homepage__filters">
          {isLoading ? (
            renderSkeletons()
          ) : (
            <>
              <H1 className="public-homepage__filters__heading-title">
                {t('filters.title')}
              </H1>
              <Text className="public-homepage__filters__heading-description">
                {t('note')}
              </Text>
              <PublicTranslatorFilters setShowTable={setShowTable} />
            </>
          )}
        </Paper>
      </Grid>
      <Grid item className="public-homepage__grid-container__result-box">
        {hasResults && (
          <PublicTranslatorListing status={status} translators={translators} />
        )}
        {hasNoResults && <H2>{t('noSearchResults')}</H2>}
      </Grid>
    </>
  );
};

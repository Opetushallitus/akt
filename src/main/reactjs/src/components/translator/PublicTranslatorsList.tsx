import { Grid, Paper } from '@mui/material';
import { useState } from 'react';

import { H1, H2, Text } from 'components/elements/Text';
import { useAppTranslation } from 'configs/i18n';
import { useAppSelector } from 'configs/redux';
import {
  publicTranslatorsSelector,
  selectFilteredPublicTranslators,
} from 'redux/selectors/translatorDetails';
import { PublicTranslatorFilters } from 'components/translator/PublicTranslatorFilters';
import { TranslatorListing } from 'components/translator/TranslatorListing';

export const PublicTranslatorsGrid = () => {
  // I18
  const { t } = useAppTranslation({ keyPrefix: 'akt.pages.homepage' });
  // Redux
  const { status } = useAppSelector(publicTranslatorsSelector);
  const translators = useAppSelector(selectFilteredPublicTranslators);
  // State
  const [showTable, setShowTable] = useState(false);
  const hasResults = translators.length > 0;
  const hasNoResults = !hasResults && showTable;

  return (
    <>
      <Grid item>
        <H1>{t('title')}</H1>
        <Text>{t('description')}</Text>
      </Grid>
      <Grid item>
        <Paper elevation={3} className="homepage__filters">
          <H1>{t('filters.title')}</H1>
          <PublicTranslatorFilters setShowTable={setShowTable} />
        </Paper>
      </Grid>
      <Grid item className="homepage__grid-container__result-box">
        {hasResults && (
          <TranslatorListing status={status} translators={translators} />
        )}
        {hasNoResults && <H2>{t('noSearchResults')}</H2>}
      </Grid>
    </>
  );
};

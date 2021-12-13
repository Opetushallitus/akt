import { FC, useEffect, useState } from 'react';
import { Box, Grid, Paper } from '@mui/material';

import { useAppDispatch, useAppSelector } from 'configs/redux';
import { useAppTranslation } from 'configs/i18n';
import { H1, Text, H2 } from 'components/elements/Text';
import { TranslatorListing } from 'components/translator/TranslatorListing';
import { loadTranslatorDetails } from 'redux/actions/translatorDetails';
import {
  publicTranslatorsSelector,
  selectFilteredPublicTranslators,
} from 'redux/selectors/translatorDetails';
import { PublicTranslatorFilters } from 'components/translator/PublicTranslatorFilters';

export const HomePage: FC = () => {
  // I18
  const { t } = useAppTranslation({ keyPrefix: 'akt.pages.homepage' });
  // Redux
  const dispatch = useAppDispatch();
  const { status } = useAppSelector(publicTranslatorsSelector);
  const translators = useAppSelector(selectFilteredPublicTranslators);
  // State
  const [showTable, setShowTable] = useState(false);
  const hasResults = translators.length > 0;
  const hasNoResults = !hasResults && showTable;

  useEffect(() => {
    dispatch(loadTranslatorDetails);
  }, [dispatch]);

  return (
    <Box className="homepage">
      <Grid
        container
        rowSpacing={4}
        direction="column"
        className="homepage__grid-container"
      >
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
      </Grid>
    </Box>
  );
};

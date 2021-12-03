import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Grid, Paper } from '@mui/material';

import { useAppDispatch, useAppSelector } from 'configs/redux';
import { H1, Text } from 'components/elements/Text';
import { TranslatorListing } from 'components/translators/TranslatorListing';
import { loadTranslatorDetails } from 'redux/actions/translatorDetails';
import { translatorDetailsSelector } from 'redux/selectors/translatorDetails';

export const HomePage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const storedTranslators = useAppSelector(translatorDetailsSelector);

  useEffect(() => {
    dispatch(loadTranslatorDetails);
  }, [dispatch]);

  return (
    <Box>
      <Grid container rowSpacing={4} direction="column">
        <Grid item>
          <Box>
            <H1>{t('akt.pages.homepage.title')}</H1>
            <Text>{t('akt.pages.homepage.description')}</Text>
          </Box>
        </Grid>
        <Grid item>
          <Paper elevation={3}>
            <TranslatorListing
              status={storedTranslators.status}
              translators={storedTranslators.translators}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

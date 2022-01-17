import { Box, Paper, Grid, Divider, Button } from '@mui/material';
import { Link } from 'react-router-dom';

import { useAppSelector } from 'configs/redux';
import { useAppTranslation } from 'configs/i18n';
import {
  RegisterControls,
  ListingFilters,
} from 'components/clerkTranslator/ClerkTranslatorFilters';
import { H1, H2, Text } from 'components/elements/Text';
import { ClerkTranslatorListing } from 'components/clerkTranslator/ClerkTranslatorListing';
import {
  clerkTranslatorsSelector,
  selectFilteredSelectedIds,
} from 'redux/selectors/clerkTranslator';
import { AppRoutes } from 'enums/app';

const SendEmailButton = () => {
  const { t } = useAppTranslation({ keyPrefix: 'akt.pages.clerkHomepage' });
  const disabled = useAppSelector(selectFilteredSelectedIds).length === 0;

  return (
    <Button
      component={Link}
      to={AppRoutes.ClerkSendEmailPage}
      color="secondary"
      variant="contained"
      disabled={disabled}
    >
      {t('sendEmail')}
    </Button>
  );
};

export const ClerkTranslatorsRegistry = () => {
  const { translators } = useAppSelector(clerkTranslatorsSelector);
  const { t } = useAppTranslation({ keyPrefix: 'akt.pages.clerkHomepage' });

  return (
    <Box className="clerk-homepage">
      <div>
        <H1>{t('title')}</H1>
        <Paper elevation={3}>
          <Grid
            container
            direction="column"
            className="clerk-homepage__grid-container"
          >
            <Grid item>
              <div
                className="columns gapped"
                data-testid="clerk-translator-registry__heading"
              >
                <H2>{t('register')}</H2>
                <Text>{`(${translators.length})`}</Text>
              </div>
            </Grid>
            <Grid item>
              <Divider />
            </Grid>
            <Grid item>
              <div className="columns">
                <div className="grow columns">
                  <RegisterControls />
                </div>
                <SendEmailButton />
              </div>
            </Grid>
            <Grid item>
              <ListingFilters />
            </Grid>
            <Grid item>
              <ClerkTranslatorListing />
            </Grid>
          </Grid>
        </Paper>
      </div>
    </Box>
  );
};

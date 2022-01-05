import { FC, useEffect } from 'react';
import { Box, Button, Divider, Grid, Paper } from '@mui/material';

import { H1, H2 } from 'components/elements/Text';
import { useAppTranslation } from 'configs/i18n';
import { useAppDispatch } from 'configs/redux';
import { loadClerkTranslators } from 'redux/actions/clerkTranslator';
import { ClerkTranslatorListing } from 'components/clerkTranslator/ClerkTranslatorListing';
import {
  ListingFilters,
  RegisterControls,
} from 'components/clerkTranslator/ClerkTranslatorFilters';

const RegisterHeading = () => {
  const { t } = useAppTranslation({ keyPrefix: 'akt.pages.clerkHomepage' });

  return <H2>{t('register')}</H2>;
};

const SendEmailButton = () => {
  const { t } = useAppTranslation({ keyPrefix: 'akt.pages.clerkHomepage' });

  return (
    <Button color="secondary" variant="contained">
      {t('sendEmail')}
    </Button>
  );
};

export const ClerkHomePage: FC = () => {
  const { t } = useAppTranslation({ keyPrefix: 'akt.pages.homepage' });
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(loadClerkTranslators);
  }, [dispatch]);

  return (
    <Box className="homepage__clerk">
      <div>
        <H1>{t('title')}</H1>
        <Paper elevation={3}>
          <Grid
            container
            direction="column"
            className="homepage__clerk__grid-container gapped"
          >
            <Grid item>
              <RegisterHeading />
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

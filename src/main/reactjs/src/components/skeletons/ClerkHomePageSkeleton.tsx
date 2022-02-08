import { Box, Button, Divider, Grid, Paper, Skeleton } from '@mui/material';
import { FC, useEffect } from 'react';
import { Link } from 'react-router-dom';

import {
  ClerkTranslatorFilters,
  RegisterControls,
} from 'components/clerkTranslator/ClerkTranslatorFilters';
import { ClerkTranslatorListing } from 'components/clerkTranslator/ClerkTranslatorListing';
import { H1, H2, Text } from 'components/elements/Text';
import { useAppTranslation } from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { APIResponseStatus } from 'enums/api';
import { AppRoutes, Color, Variant } from 'enums/app';
import {
  loadClerkTranslators,
  resetClerkTranslatorFilters,
} from 'redux/actions/clerkTranslator';
import {
  clerkTranslatorsSelector,
  selectFilteredSelectedIds,
} from 'redux/selectors/clerkTranslator';

export const ClerkHomePageSkeleton = () => {
  const { t } = useAppTranslation({ keyPrefix: 'akt.pages.clerkHomepage' });

  return (
    <Box className="clerk-homepage">
      <div>
        <Skeleton>
          <H1>{t('title')}</H1>
        </Skeleton>
        <Paper elevation={3}>
          <Grid
            container
            direction="column"
            className="clerk-homepage__grid-container"
          >
            <Skeleton>
              <Grid item>
                <div
                  className="columns gapped"
                  data-testid="clerk-translator-registry__heading"
                >
                  <H2>{t('register')}</H2>
                  <Text>{`(${translators.length})`}</Text>
                </div>
              </Grid>
            </Skeleton>

            <Grid item>
              <Divider />
            </Grid>
            <Grid item>
              <div className="columns">
                <div className="clerk-homepage__grid-container__register-controls grow columns">
                  <RegisterControls />
                </div>
              </div>
            </Grid>
            <Grid item>
              <ClerkTranslatorFilters />
            </Grid>
            <Grid item>
              <div className="columns space-between">
                <Button
                  color={Color.Secondary}
                  variant={Variant.Outlined}
                  onClick={() => dispatch(resetClerkTranslatorFilters)}
                >
                  {t('emptyBtn')}
                </Button>
                <Button
                  data-testid="clerk-translator-registry__send-email-btn"
                  component={Link}
                  to={AppRoutes.ClerkSendEmailPage}
                  color={Color.Secondary}
                  variant={Variant.Contained}
                  disabled={sendEmailButtonDisabled}
                >
                  {t('sendEmail')}
                </Button>
              </div>
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

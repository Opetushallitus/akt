import { FC, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Paper, Grid, Divider, Button } from '@mui/material';

import { useAppDispatch, useAppSelector } from 'configs/redux';
import { useAppTranslation } from 'configs/i18n';
import { H1, H2, Text } from 'components/elements/Text';
import { ClerkTranslatorListing } from 'components/clerkTranslator/ClerkTranslatorListing';
import {
  RegisterControls,
  ListingFilters,
} from 'components/clerkTranslator/ClerkTranslatorFilters';
import { AppRoutes, Color, Variant } from 'enums/app';
import { loadClerkTranslators } from 'redux/actions/clerkTranslator';
import {
  clerkTranslatorsSelector,
  selectFilteredSelectedIds,
} from 'redux/selectors/clerkTranslator';
import { APIResponseStatus } from 'enums/api';

export const ClerkHomePage: FC = () => {
  const { translators, status } = useAppSelector(clerkTranslatorsSelector);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (status === APIResponseStatus.NotStarted) {
      dispatch(loadClerkTranslators);
    }
  }, [dispatch, status]);

  const { t } = useAppTranslation({ keyPrefix: 'akt.pages.clerkHomepage' });
  const sendEmailButtonDisabled =
    useAppSelector(selectFilteredSelectedIds).length === 0;

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

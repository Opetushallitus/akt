import { Divider, Grid, Paper } from '@mui/material';
import { FC, useEffect } from 'react';

import { ClerkTranslatorAutocompleteFilters } from 'components/clerkTranslator/ClerkTranslatorAutocompleteFilters';
import { ClerkTranslatorListing } from 'components/clerkTranslator/ClerkTranslatorListing';
import { ClerkTranslatorToggleFilters } from 'components/clerkTranslator/ClerkTranslatorToggleFilters';
import { CustomButton } from 'components/elements/CustomButton';
import { CustomButtonLink } from 'components/elements/CustomButtonLink';
import { H1, H2, Text } from 'components/elements/Text';
import { ClerkHomePageSkeleton } from 'components/skeletons/ClerkHomePageSkeleton';
import { useAppTranslation, useCommonTranslation } from 'configs/i18n';
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

export const ClerkHomePageControlButtons = () => {
  const { t } = useAppTranslation({ keyPrefix: 'akt.pages.clerkHomepage' });
  const dispatch = useAppDispatch();
  const sendEmailButtonDisabled =
    useAppSelector(selectFilteredSelectedIds).length === 0;

  return (
    <>
      <CustomButton
        color={Color.Secondary}
        variant={Variant.Outlined}
        onClick={() => dispatch(resetClerkTranslatorFilters)}
      >
        {t('emptyBtn')}
      </CustomButton>
      <CustomButtonLink
        data-testid="clerk-translator-registry__send-email-btn"
        to={AppRoutes.ClerkSendEmailPage}
        color={Color.Secondary}
        variant={Variant.Contained}
        disabled={sendEmailButtonDisabled}
      >
        {t('sendEmail')}
      </CustomButtonLink>
    </>
  );
};

export const ClerkHomePage: FC = () => {
  const { translators, status } = useAppSelector(clerkTranslatorsSelector);
  const isLoading = status === APIResponseStatus.InProgress;
  const dispatch = useAppDispatch();

  const { t } = useAppTranslation({ keyPrefix: 'akt.pages.clerkHomepage' });
  const translateCommon = useCommonTranslation();

  useEffect(() => {
    if (status === APIResponseStatus.NotStarted) {
      dispatch(loadClerkTranslators);
    }
  }, [dispatch, status]);

  const renderClerkHomePageGrids = () => (
    <>
      <Grid item>
        <div
          className="columns gapped"
          data-testid="clerk-translator-registry__heading"
        >
          <H2>{translateCommon('register')}</H2>
          <Text>{`(${translators.length})`}</Text>
        </div>
      </Grid>
      <Grid item>
        <Divider />
      </Grid>
      <Grid item>
        <div className="columns">
          <div className="clerk-homepage__grid-container__register-controls grow columns">
            <ClerkTranslatorToggleFilters />
          </div>
        </div>
      </Grid>
      <Grid item>
        <ClerkTranslatorAutocompleteFilters />
      </Grid>
      <Grid item>
        <div className="columns space-between">
          <ClerkHomePageControlButtons />
        </div>
      </Grid>
      <Grid item>
        <Divider />
      </Grid>
      <Grid item>
        <ClerkTranslatorListing />
      </Grid>
    </>
  );

  return (
    <div className="clerk-homepage">
      <H1>{t('title')}</H1>
      <Paper elevation={3}>
        <Grid
          container
          direction="column"
          className="clerk-homepage__grid-container"
        >
          {isLoading ? <ClerkHomePageSkeleton /> : renderClerkHomePageGrids()}
        </Grid>
      </Paper>
    </div>
  );
};

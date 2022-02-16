import { Box, Paper } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { AuthorisationDetails } from 'components/clerkTranslator/overview/AuthorisationDetails';
import { ClerkTranslatorDetails } from 'components/clerkTranslator/overview/ClerkTranslatorDetails';
import { TopControls } from 'components/clerkTranslator/overview/TopControls';
import { H1 } from 'components/elements/Text';
import { ClerkTranslatorOverviewPageSkeleton } from 'components/skeletons/ClerkTranslatorOverviewPageSkeleton';
import { useAppTranslation } from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { APIResponseStatus } from 'enums/api';
import { AppRoutes, Severity } from 'enums/app';
import { loadClerkTranslatorOverviewByFetchingAllTranslators } from 'redux/actions/clerkTranslatorOverview';
import { showNotifierToast } from 'redux/actions/notifier';
import { clerkTranslatorsSelector } from 'redux/selectors/clerkTranslator';
import { clerkTranslatorOverviewSelector } from 'redux/selectors/clerkTranslatorOverview';
import { Utils } from 'utils';

export const ClerkTranslatorOverviewPage = () => {
  // i18n
  const { t } = useAppTranslation({ keyPrefix: 'akt' });
  // Redux
  const dispatch = useAppDispatch();
  const { status: clerkTranslatorAPIStatus } = useAppSelector(
    clerkTranslatorsSelector
  );
  const { status: clerkTranslatorOverviewAPIStatus } = useAppSelector(
    clerkTranslatorOverviewSelector
  );
  const { selectedTranslator } = useAppSelector(
    clerkTranslatorOverviewSelector
  );
  // React Router
  const navigate = useNavigate();
  const params = useParams();

  const isLoading =
    clerkTranslatorOverviewAPIStatus === APIResponseStatus.InProgress ||
    (clerkTranslatorAPIStatus === APIResponseStatus.InProgress &&
      !selectedTranslator);

  useEffect(() => {
    if (
      clerkTranslatorAPIStatus === APIResponseStatus.NotStarted &&
      params.translatorId
    ) {
      // TODO: Load only selected translator data
      dispatch(
        loadClerkTranslatorOverviewByFetchingAllTranslators(
          +params.translatorId
        )
      );
    } else if (
      !isLoading &&
      clerkTranslatorAPIStatus === APIResponseStatus.Success &&
      !selectedTranslator
    ) {
      // Show an error and redirect to homepage
      const toast = Utils.createNotifierToast(
        Severity.Error,
        t('component.clerkTranslatorOverview.toasts.notFound')
      );
      dispatch(showNotifierToast(toast));
      navigate(AppRoutes.ClerkHomePage);
    } else if (clerkTranslatorOverviewAPIStatus === APIResponseStatus.Success) {
      const toast = Utils.createNotifierToast(
        Severity.Success,
        t('component.clerkTranslatorOverview.toasts.updated')
      );
      dispatch(showNotifierToast(toast));
    } else if (clerkTranslatorAPIStatus === APIResponseStatus.Error) {
      dispatch(
        showNotifierToast(
          Utils.createNotifierToast(Severity.Error, t('errors.loadingFailed'))
        )
      );
    }
  }, [
    dispatch,
    clerkTranslatorAPIStatus,
    clerkTranslatorOverviewAPIStatus,
    t,
    params,
    navigate,
    selectedTranslator,
    isLoading,
  ]);

  return (
    <Box className="clerk-translator-overview-page">
      <H1>{t('pages.clerkTranslatorOverviewPage.title')}</H1>
      <Paper
        elevation={3}
        className="clerk-translator-overview-page__content-container rows"
      >
        {isLoading ? (
          <ClerkTranslatorOverviewPageSkeleton />
        ) : (
          <>
            <TopControls />
            <div className="rows gapped">
              <ClerkTranslatorDetails />
              <AuthorisationDetails />
            </div>
          </>
        )}
      </Paper>
    </Box>
  );
};

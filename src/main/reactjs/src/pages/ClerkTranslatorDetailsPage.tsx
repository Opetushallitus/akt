import { Box, Paper } from '@mui/material';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import {
  ClerkTranslatorDetails,
  ClerkTranslatorNotFoundView,
} from 'components/clerkTranslator/ClerkTranslatorDetails';
import { CustomCircularProgress } from 'components/elements/CustomCircularProgress';
import { H1 } from 'components/elements/Text';
import { useAppTranslation } from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { APIResponseStatus } from 'enums/api';
import { Color, Severity } from 'enums/app';
import { loadClerkTranslators } from 'redux/actions/clerkTranslator';
import { showNotifierToast } from 'redux/actions/notifier';
import { clerkTranslatorsSelector } from 'redux/selectors/clerkTranslator';
import { Utils } from 'utils';

const paramAsNum = (param: string | undefined) => {
  if (param) {
    return parseInt(param);
  }
};

const TranslatorViewDispatcher = () => {
  const params = useParams();
  const translatorId = paramAsNum(params.translatorId);

  const { status, translators } = useAppSelector(clerkTranslatorsSelector);
  // TODO Instead of looking up translator here and passing it along to child components,
  // we might wish to instead maintain the selected (or added / updated) translator details
  // as its own entity in redux. This decision could ideally be done when implementing the views
  // for adding new / updating existing translator.
  // When making this decision, plan for easy reusability of UI code!
  const translator = translatorId
    ? translators.find(({ id }) => translatorId == id)
    : undefined;

  switch (status) {
    case APIResponseStatus.NotStarted:
    case APIResponseStatus.InProgress:
      return <CustomCircularProgress color={Color.Secondary} />;
    case APIResponseStatus.Cancelled:
    case APIResponseStatus.Error:
      return <div />;
    case APIResponseStatus.Success:
      if (translator) {
        return <ClerkTranslatorDetails translator={translator} />;
      } else {
        return <ClerkTranslatorNotFoundView />;
      }
  }
};

export const ClerkTranslatorDetailsPage = () => {
  // i18n
  const { t } = useAppTranslation({ keyPrefix: 'akt' });
  // Redux
  const dispatch = useAppDispatch();
  const { status } = useAppSelector(clerkTranslatorsSelector);

  useEffect(() => {
    if (status == APIResponseStatus.NotStarted) {
      dispatch(loadClerkTranslators);
    } else if (status == APIResponseStatus.Error) {
      dispatch(
        showNotifierToast(
          Utils.createNotifierToast(Severity.Error, t('errors.loadingFailed'))
        )
      );
    }
  }, [dispatch, status, t]);

  return (
    <Box className="clerk-send-email-page">
      <H1>{t('pages.clerkTranslatorDetailsPage.title')}</H1>
      <Paper
        elevation={3}
        className="clerk-translator-details-page__content-container"
      >
        <TranslatorViewDispatcher />
      </Paper>
    </Box>
  );
};

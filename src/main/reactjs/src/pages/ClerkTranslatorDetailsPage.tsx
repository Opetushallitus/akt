import { Box, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

import { H1, H2 } from 'components/elements/Text';
import { ProgressIndicator } from 'components/elements/ProgressIndicator';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { useAppTranslation } from 'configs/i18n';
import { clerkTranslatorsSelector } from 'redux/selectors/clerkTranslator';
import { APIResponseStatus } from 'enums/api';
import { Color, Severity } from 'enums/app';
import { loadClerkTranslators } from 'redux/actions/clerkTranslator';
import { showNotifierToast } from 'redux/actions/notifier';
import { Utils } from 'utils';
import { ClerkTranslator } from 'interfaces/clerkTranslator';

const paramAsNum = (param: string | undefined) => {
  if (param) {
    return parseInt(param);
  }
};

const TranslatorNotFoundView = () => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.pages.clerkTranslatorDetailsPage.translatorNotFoundView',
  });

  return (
    <Paper
      elevation={3}
      className="clerk-translator-details-page__content-container"
    >
      <H2>{t('title')}</H2>
    </Paper>
  );
};

const TranslatorDetailsView = ({
  translator,
}: {
  translator: ClerkTranslator;
}) => {
  return (
    <Paper
      elevation={3}
      className="clerk-translator-details-page__content-container"
    >
      <H2>{translator.contactDetails.firstName}</H2>
    </Paper>
  );
};

const TranslatorViewDispatcher = () => {
  const params = useParams();
  const translatorId = paramAsNum(params.translatorId);

  const { status, translators } = useAppSelector(clerkTranslatorsSelector);
  const translator = translatorId
    ? translators.find(({ id }) => translatorId == id)
    : undefined;

  switch (status) {
    case APIResponseStatus.NotStarted:
    case APIResponseStatus.InProgress:
      return <ProgressIndicator color={Color.Secondary} />;
    case APIResponseStatus.Cancelled:
    case APIResponseStatus.Error:
      return <div />;
    case APIResponseStatus.Success:
      if (translator) {
        return <TranslatorDetailsView translator={translator} />;
      } else {
        return <TranslatorNotFoundView />;
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
      <TranslatorViewDispatcher />
    </Box>
  );
};

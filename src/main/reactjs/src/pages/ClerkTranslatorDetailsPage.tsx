import { Box, Button, Paper, TextField, TextFieldProps } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

import { H1, H2, H3 } from 'components/elements/Text';
import { ProgressIndicator } from 'components/elements/ProgressIndicator';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { useAppTranslation } from 'configs/i18n';
import { APIResponseStatus } from 'enums/api';
import { Color, Severity, Variant } from 'enums/app';
import { ClerkTranslator } from 'interfaces/clerkTranslator';
import { clerkTranslatorsSelector } from 'redux/selectors/clerkTranslator';
import { loadClerkTranslators } from 'redux/actions/clerkTranslator';
import { showNotifierToast } from 'redux/actions/notifier';
import { Utils } from 'utils';

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

const TranslatorDetailsField = ({ ...rest }: TextFieldProps) => {
  return <TextField {...rest} />;
};

const TranslatorDetailsView = ({
  translator,
}: {
  translator: ClerkTranslator;
}) => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.clerkTranslatorDetails',
  });

  return (
    <Paper
      elevation={3}
      className="clerk-translator-details-page__content-container"
    >
      <div className="rows gapped">
        <div className="columns">
          <H3 className="grow">{t('header.personalInformation')}</H3>
          <Button variant={Variant.Contained} color={Color.Secondary}>
            {t('buttons.edit')}
          </Button>
        </div>
        <div className="columns gapped">
          <TranslatorDetailsField
            label={t('labels.lastName')}
            value={translator.contactDetails.lastName}
            disabled
          />
          <TranslatorDetailsField
            label={t('labels.firstNames')}
            value={translator.contactDetails.firstName}
            disabled
          />
          <TranslatorDetailsField
            label={t('labels.ssn')}
            value={translator.contactDetails.identityNumber}
            disabled
          />
        </div>
        <H3>{t('header.address')}</H3>
        <div className="columns gapped">
          <TranslatorDetailsField
            label={t('labels.streetAddress')}
            value={translator.contactDetails.street}
            disabled
          />
          <TranslatorDetailsField
            label={t('labels.zipCode')}
            value={translator.contactDetails.postalCode}
            disabled
          />
          <TranslatorDetailsField
            label={t('labels.postOffice')}
            value={translator.contactDetails.town}
            disabled
          />
          <TranslatorDetailsField
            label={t('labels.country')}
            value={translator.contactDetails.country}
            disabled
          />
        </div>
        <H3>{t('header.contactInformation')}</H3>
        <div className="columns gapped">
          <TranslatorDetailsField
            label={t('labels.email')}
            value={translator.contactDetails.email}
            disabled
          />
          <TranslatorDetailsField
            label={t('labels.phoneNumber')}
            value={translator.contactDetails.phoneNumber}
            disabled
          />
        </div>
      </div>
    </Paper>
  );
};

const TranslatorViewDispatcher = () => {
  const params = useParams();
  const translatorId = paramAsNum(params.translatorId);

  const { status, translators } = useAppSelector(clerkTranslatorsSelector);
  // TODO Manage selected (possibly edited) translator details in redux.
  // Consider also storing translators in redux with an index on their ids
  // => allows for fast (and ergonomic) lookups by id
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

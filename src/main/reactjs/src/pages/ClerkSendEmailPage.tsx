import { Box, Button, Paper } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { H1, H2, Text } from 'components/elements/Text';
import { TextBox } from 'components/elements/TextBox';
import { useAppTranslation } from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { APIResponseStatus } from 'enums/api';
import { AppRoutes, Color, Severity, TextBoxTypes, Variant } from 'enums/app';
import {
  resetClerkTranslatorEmail,
  setClerkTranslatorEmail,
  setClerkTranslatorEmailRecipients,
} from 'redux/actions/clerkTranslatorEmail';
import { showNotifierDialog } from 'redux/actions/notifier';
import {
  NOTIFIER_ACTION_CLERK_TRANSLATOR_EMAIL_RESET,
  NOTIFIER_ACTION_CLERK_TRANSLATOR_EMAIL_SEND,
  NOTIFIER_ACTION_DO_NOTHING,
} from 'redux/actionTypes/notifier';
import {
  selectFilteredSelectedIds,
  selectFilteredSelectedTranslators,
} from 'redux/selectors/clerkTranslator';
import { selectClerkTranslatorEmail } from 'redux/selectors/clerkTranslatorEmail';
import { Utils } from 'utils/index';

const ControlButtons = ({ submitDisabled }: { submitDisabled: boolean }) => {
  // i18n
  const { t } = useAppTranslation({
    keyPrefix: 'akt.pages.clerkSendEmailPage',
  });

  // Redux
  const dispatch = useAppDispatch();
  const translatorIds = useAppSelector(selectFilteredSelectedIds);

  // Dialogs
  const dispatchCancelNotifier = () => {
    const notifier = Utils.createNotifierDialog(
      t('dialogs.cancel.title'),
      Severity.Info,
      t('dialogs.cancel.description'),
      [
        {
          title: t('dialogs.cancel.back'),
          variant: Variant.Outlined,
          action: NOTIFIER_ACTION_DO_NOTHING,
        },
        {
          title: t('dialogs.cancel.yes'),
          variant: Variant.Contained,
          action: NOTIFIER_ACTION_CLERK_TRANSLATOR_EMAIL_RESET,
        },
      ]
    );
    dispatch(showNotifierDialog(notifier));
  };

  const dispatchSendEmailNotifier = () => {
    dispatch(setClerkTranslatorEmailRecipients(translatorIds));
    const notifier = Utils.createNotifierDialog(
      t('dialogs.send.title'),
      Severity.Info,
      t('dialogs.send.description', { count: translatorIds.length }),
      [
        {
          title: t('dialogs.send.back'),
          variant: Variant.Outlined,
          action: NOTIFIER_ACTION_DO_NOTHING,
        },
        {
          title: t('dialogs.send.yes'),
          variant: Variant.Contained,
          action: NOTIFIER_ACTION_CLERK_TRANSLATOR_EMAIL_SEND,
        },
      ]
    );
    dispatch(showNotifierDialog(notifier));
  };

  return (
    <div className="columns gapped flex-end">
      <Button
        data-testid="clerk-send-email-page__cancel-btn"
        variant={Variant.Outlined}
        color={Color.Secondary}
        onClick={dispatchCancelNotifier}
      >
        {t('buttons.cancel')}
      </Button>
      <Button
        data-testid="clerk-send-email-page__send-btn"
        variant={Variant.Contained}
        color={Color.Secondary}
        disabled={submitDisabled}
        onClick={dispatchSendEmailNotifier}
      >
        {t('buttons.send')}
      </Button>
    </div>
  );
};

export const ClerkSendEmailPage = () => {
  // i18n
  const { t } = useAppTranslation({
    keyPrefix: 'akt',
  });

  // Redux
  const translators = useAppSelector(selectFilteredSelectedTranslators);
  const { email, status } = useAppSelector(selectClerkTranslatorEmail);
  const dispatch = useAppDispatch();
  const setEmailSubject = (subject: string) =>
    dispatch(setClerkTranslatorEmail({ subject }));
  const setEmailBody = (body: string) =>
    dispatch(setClerkTranslatorEmail({ body }));

  // Local state
  const initialFieldErrors = { subject: '', message: '' };
  const [fieldErrors, setFieldErrors] =
    useState<typeof initialFieldErrors>(initialFieldErrors);
  const submitDisabled =
    Utils.isEmptyString(email.subject) ||
    Utils.isEmptyString(email.body) ||
    translators.length == 0;

  // Navigation
  const navigate = useNavigate();
  useEffect(() => {
    if (
      status == APIResponseStatus.Success ||
      status == APIResponseStatus.Cancelled
    ) {
      dispatch(resetClerkTranslatorEmail);
      navigate(AppRoutes.ClerkHomePage);
    }
  }, [dispatch, navigate, status]);

  const handleFieldError =
    (field: 'subject' | 'message') =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value, required } = event.target;
      const error = Utils.inspectTextBoxErrors(
        field == 'subject' ? TextBoxTypes.Text : TextBoxTypes.Textarea,
        value,
        required
      );
      const errorMessage = error ? t(error) : '';
      setFieldErrors({ ...fieldErrors, [field]: errorMessage });
    };

  const handleSubjectChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEmailSubject(event.target.value);
    handleFieldError('subject')(event);
  };

  const handleMessageChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEmailBody(event.target.value);
    handleFieldError('message')(event);
  };

  return (
    <Box className="clerk-send-email-page">
      <H1>{t('pages.clerkSendEmailPage.title')}</H1>
      <Paper className="clerk-send-email-page__form-container" elevation={3}>
        <div className="rows gapped clerk-send-email-page__form-contents">
          <div className="rows gapped">
            <H2>{t('pages.clerkSendEmailPage.sections.recipients')}</H2>
            <Text>
              {t('pages.clerkSendEmailPage.selectedCount', {
                count: translators.length,
              })}
            </Text>
          </div>
          <div className="rows gapped">
            <H2>{t('pages.clerkSendEmailPage.sections.subject')}</H2>
            <TextBox
              data-testid="clerk-send-email-page__subject"
              label={t('pages.clerkSendEmailPage.labels.subject')}
              value={email.subject}
              onChange={handleSubjectChange}
              onBlur={handleFieldError('subject')}
              error={fieldErrors.subject.length > 0}
              helperText={fieldErrors.subject}
              required
            />
          </div>
          <div className="rows gapped">
            <H2>{t('pages.clerkSendEmailPage.sections.message')}</H2>
            <TextBox
              data-testid="clerk-send-email-page__message"
              label={t('pages.clerkSendEmailPage.labels.message')}
              rows={5}
              value={email.body}
              onChange={handleMessageChange}
              onBlur={handleFieldError('message')}
              error={fieldErrors.message.length > 0}
              helperText={fieldErrors.message}
              multiline
              required
            />
          </div>
        </div>
        <ControlButtons submitDisabled={submitDisabled} />
      </Paper>
    </Box>
  );
};

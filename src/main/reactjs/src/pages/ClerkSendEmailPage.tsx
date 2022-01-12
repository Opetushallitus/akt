import { Box, Button, IconButton, Paper } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useState } from 'react';

import { H1, H2, Text } from 'components/elements/Text';
import { useAppTranslation } from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import {
  selectFilteredSelectedIds,
  selectFilteredSelectedTranslators,
} from 'redux/selectors/clerkTranslator';
import { TextBox } from 'components/elements/TextBox';
import { Severity, Variant } from 'enums/app';
import { Utils } from 'utils/index';
import { selectClerkTranslatorEmail } from 'redux/selectors/clerkTranslatorEmail';
import {
  setClerkTranslatorEmail,
  setClerkTranslatorEmailRecipients,
} from 'redux/actions/clerkTranslatorEmail';
import {
  NOTIFIER_ACTION_CLERK_TRANSLATOR_EMAIL_RESET,
  NOTIFIER_ACTION_CLERK_TRANSLATOR_EMAIL_SEND,
  NOTIFIER_ACTION_DO_NOTHING,
} from 'redux/actionTypes/notifier';
import { showNotifierDialog } from 'redux/actions/notifier';

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
        variant={Variant.Outlined}
        color="secondary"
        onClick={dispatchCancelNotifier}
      >
        {t('buttons.cancel')}
      </Button>
      <Button
        variant={Variant.Contained}
        color="secondary"
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
    keyPrefix: 'akt.pages.clerkSendEmailPage',
  });

  // Redux
  const translators = useAppSelector(selectFilteredSelectedTranslators);
  const { email } = useAppSelector(selectClerkTranslatorEmail);
  const dispatch = useAppDispatch();
  const setEmailSubject = (subject: string) =>
    dispatch(setClerkTranslatorEmail({ subject }));
  const setEmailBody = (body: string) =>
    dispatch(setClerkTranslatorEmail({ body }));

  // Local state
  const [messageError, setMessageError] = useState(false);
  const [subjectError, setSubjectError] = useState(false);

  const submitDisabled =
    Utils.isEmptyString(email.subject) || Utils.isEmptyString(email.body);

  return (
    <Box className="clerk-send-email-page">
      <div>
        <H1>{t('title')}</H1>
        <Paper className="clerk-send-email-page__form-container" elevation={3}>
          <div className="rows gapped clerk-send-email-page__form-contents">
            <div className="rows gapped">
              <H2>{t('sections.recipients')}</H2>
              <div className="half-max-width">
                {translators.map(({ id, contactDetails }) => (
                  <div key={id} className="columns gapped">
                    <Text className="grow">{`${contactDetails.firstName} ${contactDetails.lastName}`}</Text>
                    <IconButton>
                      <DeleteOutlineIcon className="clerk-send-email-page__delete-outline-icon" />
                    </IconButton>
                  </div>
                ))}
              </div>
            </div>
            <div className="rows gapped">
              <H2>{t('sections.subject')}</H2>
              <TextBox
                placeholder={t('placeholders.subject')}
                value={email.subject}
                onChange={(e) => setEmailSubject(e.target.value)}
                onBlur={(e) =>
                  setSubjectError(Utils.isEmptyString(e.target.value))
                }
                error={subjectError}
                required
              />
            </div>
            <div className="rows gapped">
              <H2>{t('sections.message')}</H2>
              <TextBox
                placeholder={t('placeholders.message')}
                rows={5}
                value={email.body}
                onChange={(e) => setEmailBody(e.target.value)}
                onBlur={(e) =>
                  setMessageError(Utils.isEmptyString(e.target.value))
                }
                error={messageError}
                multiline
                required
              />
            </div>
          </div>
          <ControlButtons submitDisabled={submitDisabled} />
        </Paper>
      </div>
    </Box>
  );
};

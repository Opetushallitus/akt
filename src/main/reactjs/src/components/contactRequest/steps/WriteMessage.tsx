import { ChangeEvent, useEffect, useState } from 'react';

import {
  ChosenTranslators,
  ChosenTranslatorsHeading,
  DisplayContactInfo,
  StepHeading,
} from 'components/contactRequest/ContactRequestFormUtils';
import { CustomTextField } from 'components/elements/CustomTextField';
import { H3 } from 'components/elements/Text';
import { translateOutsideComponent, useAppTranslation } from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { TextFieldTypes } from 'enums/app';
import { ContactRequestFormStep } from 'enums/contactRequest';
import { useWindowProperties } from 'hooks/useWindowProperties';
import { setContactRequest } from 'redux/actions/contactRequest';
import { contactRequestSelector } from 'redux/selectors/contactRequest';
import { Utils } from 'utils';
import { StringUtils } from 'utils/string';

const getErrorForMessage = (message: string) => {
  const t = translateOutsideComponent();
  const error = Utils.inspectCustomTextFieldErrors(
    TextFieldTypes.Textarea,
    message,
    true
  );

  return error ? t(`akt.${error}`) : '';
};

export const WriteMessage = ({
  disableNext,
}: {
  disableNext: (disabled: boolean) => void;
}) => {
  // I18n
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.contactRequestForm',
  });

  //Windows properties
  const { isPhone } = useWindowProperties();

  // State
  const [fieldError, setFieldError] = useState('');

  // Redux
  const { request } = useAppSelector(contactRequestSelector);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const hasBlankMessage = StringUtils.isBlankString(request?.message);
    // Instead of relying on fieldError in local state, compute the error text
    // separately to ensure that we can disable the next button independently of
    // showing the error labels. The error label is to be shown only
    // after an onBlur event has occurred.
    const hasFieldError = getErrorForMessage(request?.message || '').length > 0;

    disableNext(hasBlankMessage || hasFieldError);
  }, [disableNext, fieldError, request]);

  const handleMessageFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (fieldError) {
      handleMessageFieldErrors(event);
    }
    dispatch(setContactRequest({ message: event.target.value }));
  };

  const handleMessageFieldErrors = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    setFieldError(getErrorForMessage(value));
  };

  const getHelperMessage = () => {
    const value = request?.message;
    const errorToShow = fieldError ? `${fieldError}.` : '';
    const maxLength = Utils.getMaxTextAreaLength();

    return `${errorToShow} ${value?.length} / ${maxLength} ${t('characters')}`;
  };

  return (
    <div className="rows">
      <StepHeading step={ContactRequestFormStep.WriteMessage} />
      <div className="rows gapped">
        <ChosenTranslatorsHeading />
        <ChosenTranslators />
        {!isPhone && <DisplayContactInfo />}
        <div className="rows gapped">
          <H3>
            {t(
              `steps.${
                ContactRequestFormStep[ContactRequestFormStep.WriteMessage]
              }`
            )}
          </H3>
          <CustomTextField
            id="contact-request-page__message-field"
            label={t('formLabels.writeMessageHere')}
            value={request?.message}
            type={TextFieldTypes.Textarea}
            onBlur={handleMessageFieldErrors}
            onChange={handleMessageFieldChange}
            showHelperText
            helperText={getHelperMessage()}
            error={fieldError.length > 0}
            multiline
            fullWidth
            required
          />
        </div>
      </div>
    </div>
  );
};

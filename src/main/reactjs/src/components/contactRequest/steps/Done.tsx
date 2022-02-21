import { useEffect } from 'react';

import {
  StepHeading,
  stepsByIndex,
} from 'components/contactRequest/ContactRequestFormUtils';
import { CustomButton } from 'components/elements/CustomButton';
import { H2, Text } from 'components/elements/Text';
import { useAppTranslation, useCommonTranslation } from 'configs/i18n';
import { useAppDispatch } from 'configs/redux';
import { Duration } from 'enums/app';
import { resetContactRequestAndRedirect } from 'redux/actions/contactRequest';

export const Done = () => {
  // I18n
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.contactRequestForm.doneStep',
  });
  const translateCommon = useCommonTranslation();

  // Redux
  const dispatch = useAppDispatch();

  const resetAndRedirect = () => {
    dispatch(resetContactRequestAndRedirect);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      resetAndRedirect();
    }, Duration.MediumExtra);

    return () => clearTimeout(timer);
  });

  return (
    <div className="rows">
      <StepHeading step={stepsByIndex[4]} />
      <div className="rows gapped">
        <div className="rows gapped">
          <H2>{t('title')}</H2>
          <Text>{t('description')}</Text>
          <CustomButton
            className="align-self-start margin-top-xxl"
            color="secondary"
            variant="contained"
            onClick={resetAndRedirect}
            data-testid="contact-request-page__homepage-btn"
          >
            {translateCommon('frontPage')}
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { CustomButton } from 'components/elements/CustomButton';
import { CustomTextField } from 'components/elements/CustomTextField';
import { H3 } from 'components/elements/Text';
import { useAppTranslation, useCommonTranslation } from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { APIResponseStatus } from 'enums/api';
import { Color, Mode, Variant } from 'enums/app';
import { ClerkTranslator } from 'interfaces/clerkTranslator';
import { updateClerkTranslatorDetails } from 'redux/actions/clerkTranslatorOverview';
import { clerkTranslatorOverviewSelector } from 'redux/selectors/clerkTranslatorOverview';

export const ClerkTranslatorDetails = () => {
  // Redux
  const dispatch = useAppDispatch();
  const { selectedTranslator, status } = useAppSelector(
    clerkTranslatorOverviewSelector
  );

  // React router
  const [searchParams, setSearchParams] = useSearchParams();
  // Local State
  const [contactDetails, setContactDetails] = useState(selectedTranslator);
  const currentMode = searchParams.get('mode');
  const isViewMode =
    currentMode === Mode.View ||
    currentMode === Mode.EditingAuthorizationDetails;

  // I18n
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.clerkTranslatorOverview',
  });

  const translateCommon = useCommonTranslation();

  useEffect(() => {
    if (!currentMode) setSearchParams({ mode: Mode.View });
  });

  useEffect(() => {
    if (status === APIResponseStatus.Success) {
      setSearchParams({ mode: Mode.View });
    }
  }, [status, setSearchParams]);

  const getCommonTextFieldProps = (field: keyof ClerkTranslator) => ({
    'data-testid': `clerk-translator-overview__translator-details__field-${field}`,
    disabled: isViewMode,
    label: t(`translatorDetails.fields.${field}`),
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      handleContactDetailsChange(e)(field),
    value: contactDetails ? contactDetails[field] : undefined,
  });

  const handleContactDetailsChange =
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (field: keyof ClerkTranslator) => {
      const updatedContactDetails = {
        ...contactDetails,
        [field]: event.target.value,
      };
      setContactDetails(updatedContactDetails);
    };

  const handleSaveBtnClick = () => {
    dispatch(updateClerkTranslatorDetails(contactDetails));
  };

  const handleEditBtnClick = () => {
    setSearchParams({ mode: Mode.EditingContactDetails });
  };

  const handleCancelBtnClick = () => {
    setSearchParams({ mode: Mode.View });
  };

  const renderControlButtons = () => (
    <div className="columns margin-top-lg">
      <div className="columns margin-top-lg">
        <H3 className="grow">{t('header.personalInformation')}</H3>
        <CustomButton
          data-testid="clerk-translator-overview__translator-details__edit-btn"
          variant={Variant.Contained}
          color={Color.Secondary}
        >
          {translateCommon('edit')}
        </CustomButton>
      </div>
      {isViewMode ? (
        <Button
          data-testid="clerk-translator-overview__translator-details__edit-btn"
          variant={Variant.Contained}
          color={Color.Secondary}
          startIcon={<EditIcon />}
          onClick={handleEditBtnClick}
          disabled={!isViewMode}
        >
          {t('translatorDetails.buttons.edit')}
        </Button>
      ) : (
        <div className="columns gapped">
          <Button
            data-testid="clerk-translator-overview__translator-details__edit-btn"
            variant={Variant.Text}
            color={Color.Secondary}
            onClick={handleCancelBtnClick}
          >
            Peruuta
          </Button>
          <Button
            data-testid="clerk-translator-overview__translator-details__edit-btn"
            variant={Variant.Contained}
            color={Color.Secondary}
            onClick={handleSaveBtnClick}
          >
            Tallenna
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {renderControlButtons()}
      <div className="grid-columns gapped">
        <CustomTextField {...getCommonTextFieldProps('lastName')} />
        <CustomTextField {...getCommonTextFieldProps('firstName')} />
        <CustomTextField {...getCommonTextFieldProps('identityNumber')} />
      </div>
      <H3>{t('translatorDetails.header.address')}</H3>
      <div className="grid-columns gapped">
        <CustomTextField {...getCommonTextFieldProps('street')} />
        <CustomTextField {...getCommonTextFieldProps('postalCode')} />
        <CustomTextField {...getCommonTextFieldProps('town')} />
        <CustomTextField {...getCommonTextFieldProps('country')} />
      </div>
      <H3>{t('translatorDetails.header.contactInformation')}</H3>
      <div className="grid-columns gapped">
        <CustomTextField {...getCommonTextFieldProps('email')} />
        <CustomTextField {...getCommonTextFieldProps('phoneNumber')} />
      </div>
      <H3>{t('translatorDetails.header.extraInformation')}</H3>
      <CustomTextField
        {...getCommonTextFieldProps('extraInformation')}
        multiline
        fullWidth
        rows={4}
      />
    </>
  );
};

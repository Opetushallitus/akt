import EditIcon from '@mui/icons-material/Edit';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { URLSearchParamsInit, useSearchParams } from 'react-router-dom';

import { CustomButton } from 'components/elements/CustomButton';
import { CustomTextField } from 'components/elements/CustomTextField';
import { H3 } from 'components/elements/Text';
import { useAppTranslation, useCommonTranslation } from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { APIResponseStatus } from 'enums/api';
import { Color, Mode, Severity, Variant } from 'enums/app';
import { usePrevious } from 'hooks/usePrevious';
import { ClerkTranslator } from 'interfaces/clerkTranslator';
import { updateClerkTranslatorDetails } from 'redux/actions/clerkTranslatorOverview';
import { showNotifierToast } from 'redux/actions/notifier';
import { clerkTranslatorOverviewSelector } from 'redux/selectors/clerkTranslatorOverview';
import { Utils } from 'utils';

export const ClerkTranslatorDetails = () => {
  // Redux
  const dispatch = useAppDispatch();
  const { selectedTranslator, status } = useAppSelector(
    clerkTranslatorOverviewSelector
  );

  // React router
  const [searchParams, setSearchParams] = useSearchParams();
  const replaceSearchParams = useCallback(
    (param: URLSearchParamsInit) => {
      setSearchParams(param, { replace: true });
    },
    [setSearchParams]
  );

  // Local State
  const [translatorDetails, setTranslatorDetails] =
    useState(selectedTranslator);
  const currentMode = searchParams.get('mode');
  const prevTranslatorDetails = usePrevious(translatorDetails);
  const isViewMode =
    currentMode === Mode.View ||
    currentMode === Mode.EditingAuthorizationDetails;

  // I18n
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.clerkTranslatorOverview',
  });

  const translateCommon = useCommonTranslation();

  useEffect(() => {
    if (!currentMode) {
      replaceSearchParams({ mode: Mode.View });
    }
  }, [currentMode, replaceSearchParams]);

  useEffect(() => {
    if (
      status === APIResponseStatus.Success &&
      currentMode === Mode.EditingTranslatorDetails &&
      selectedTranslator?.version != prevTranslatorDetails?.version
    ) {
      const toast = Utils.createNotifierToast(
        Severity.Success,
        t('toasts.updated')
      );
      dispatch(showNotifierToast(toast));
      replaceSearchParams({ mode: Mode.View });
    }
  });

  const getCommonTextFieldProps = (field: keyof ClerkTranslator) => ({
    'data-testid': `clerk-translator-overview__translator-details__field-${field}`,
    disabled: isViewMode,
    label: t(`translatorDetails.fields.${field}`),
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      handletranslatorDetailsChange(e)(field),
    value: translatorDetails ? translatorDetails[field] : undefined,
  });

  const handletranslatorDetailsChange =
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (field: keyof ClerkTranslator) => {
      const updatedtranslatorDetails = {
        ...translatorDetails,
        [field]: event.target.value,
      };
      setTranslatorDetails(updatedtranslatorDetails as ClerkTranslator);
    };

  const handleSaveBtnClick = () => {
    dispatch(
      updateClerkTranslatorDetails(translatorDetails as ClerkTranslator)
    );
  };

  const handleEditBtnClick = () => {
    replaceSearchParams({ mode: Mode.EditingTranslatorDetails });
  };

  const handleCancelBtnClick = () => {
    replaceSearchParams({ mode: Mode.View });
  };

  const renderControlButtons = () => (
    <div className="columns margin-top-lg">
      <div className="columns margin-top-lg grow">
        <H3>{t('translatorDetails.header.personalInformation')}</H3>
      </div>
      {isViewMode ? (
        <CustomButton
          data-testid="clerk-translator-overview__translator-details__edit-btn"
          variant={Variant.Contained}
          color={Color.Secondary}
          startIcon={<EditIcon />}
          onClick={handleEditBtnClick}
          disabled={!isViewMode}
        >
          {translateCommon('edit')}
        </CustomButton>
      ) : (
        <div className="columns gapped">
          <CustomButton
            data-testid="clerk-translator-overview__translator-details__cancel-btn"
            variant={Variant.Text}
            color={Color.Secondary}
            onClick={handleCancelBtnClick}
          >
            {translateCommon('cancel')}
          </CustomButton>
          <CustomButton
            data-testid="clerk-translator-overview__translator-details__save-btn"
            variant={Variant.Contained}
            color={Color.Secondary}
            onClick={handleSaveBtnClick}
          >
            {translateCommon('save')}
          </CustomButton>
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

import EditIcon from '@mui/icons-material/Edit';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { URLSearchParamsInit, useSearchParams } from 'react-router-dom';

import { CustomButton } from 'components/elements/CustomButton';
import { CustomTextField } from 'components/elements/CustomTextField';
import { H3 } from 'components/elements/Text';
import { useAppTranslation, useCommonTranslation } from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { APIResponseStatus } from 'enums/api';
import { Color, Severity, UIMode, Variant } from 'enums/app';
import { usePrevious } from 'hooks/usePrevious';
import { ClerkTranslator } from 'interfaces/clerkTranslator';
import { updateClerkTranslatorDetails } from 'redux/actions/clerkTranslatorOverview';
import { showNotifierToast } from 'redux/actions/notifier';
import { clerkTranslatorOverviewSelector } from 'redux/selectors/clerkTranslatorOverview';
import { Utils } from 'utils';

export const ClerkTranslatorDetails = () => {
  // Redux
  const dispatch = useAppDispatch();
  const { selectedTranslator, translatorDetailsStatus } = useAppSelector(
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
  const currentUIMode = searchParams.get('mode');
  const prevTranslatorDetails = usePrevious(translatorDetails);
  const isViewMode =
    currentUIMode === UIMode.View ||
    currentUIMode === UIMode.EditAuthorizationDetails;

  // I18n
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.clerkTranslatorOverview',
  });

  const translateCommon = useCommonTranslation();

  useEffect(() => {
    if (!currentUIMode) {
      replaceSearchParams({ mode: UIMode.View });
    }
  }, [currentUIMode, replaceSearchParams]);

  useEffect(() => {
    if (
      translatorDetailsStatus === APIResponseStatus.Success &&
      currentUIMode === UIMode.EditTranslatorDetails &&
      selectedTranslator?.version != prevTranslatorDetails?.version
    ) {
      const toast = Utils.createNotifierToast(
        Severity.Success,
        t('toasts.updated')
      );
      dispatch(showNotifierToast(toast));
      replaceSearchParams({ mode: UIMode.View });
    }
  });

  const getCommonTextFieldProps = (field: keyof ClerkTranslator) => ({
    'data-testid': `clerk-translator-overview__translator-details__field-${field}`,
    disabled: isViewMode,
    label: t(`translatorDetails.fields.${field}`),
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      handleTranslatorDetailsChange(e)(field),
    value: translatorDetails ? translatorDetails[field] : undefined,
  });

  const handleTranslatorDetailsChange =
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (field: keyof ClerkTranslator) => {
      const updatedTranslatorDetails = {
        ...translatorDetails,
        [field]: event.target.value,
      };
      setTranslatorDetails(updatedTranslatorDetails as ClerkTranslator);
    };

  const handleSaveBtnClick = () => {
    dispatch(
      updateClerkTranslatorDetails(translatorDetails as ClerkTranslator)
    );
  };

  const handleEditBtnClick = () => {
    replaceSearchParams({ mode: UIMode.EditTranslatorDetails });
  };

  const handleCancelBtnClick = () => {
    replaceSearchParams({ mode: UIMode.View });
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
      />
    </>
  );
};

import EditIcon from '@mui/icons-material/Edit';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { URLSearchParamsInit, useSearchParams } from 'react-router-dom';

import { ClerkTranslatorDetailsFields } from 'components/clerkTranslator/overview/ClerkTranslatorDetailsFields';
import { CustomButton } from 'components/elements/CustomButton';
import { useAppTranslation, useCommonTranslation } from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { APIResponseStatus } from 'enums/api';
import { Color, Severity, UIMode, Variant } from 'enums/app';
import { usePrevious } from 'hooks/usePrevious';
import {
  ClerkTranslator,
  ClerkTranslatorBasicInformation,
} from 'interfaces/clerkTranslator';
import { updateClerkTranslatorDetails } from 'redux/actions/clerkTranslatorOverview';
import { showNotifierToast } from 'redux/actions/notifier';
import { clerkTranslatorOverviewSelector } from 'redux/selectors/clerkTranslatorOverview';
import { Utils } from 'utils';

const ControlButtons = ({
  isViewMode,
  onCancelBtnClick,
  onEditBtnClick,
  onSaveBtnClick,
}: {
  isViewMode: boolean;
  onCancelBtnClick: () => void;
  onEditBtnClick: () => void;
  onSaveBtnClick: () => void;
}) => {
  const translateCommon = useCommonTranslation();

  if (isViewMode) {
    return (
      <CustomButton
        data-testid="clerk-translator-overview__translator-details__edit-btn"
        variant={Variant.Contained}
        color={Color.Secondary}
        startIcon={<EditIcon />}
        onClick={onEditBtnClick}
        disabled={!isViewMode}
      >
        {translateCommon('edit')}
      </CustomButton>
    );
  } else {
    return (
      <div className="columns gapped">
        <CustomButton
          data-testid="clerk-translator-overview__translator-details__cancel-btn"
          variant={Variant.Text}
          color={Color.Secondary}
          onClick={onCancelBtnClick}
        >
          {translateCommon('cancel')}
        </CustomButton>
        <CustomButton
          data-testid="clerk-translator-overview__translator-details__save-btn"
          variant={Variant.Contained}
          color={Color.Secondary}
          onClick={onSaveBtnClick}
        >
          {translateCommon('save')}
        </CustomButton>
      </div>
    );
  }
};

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

  const handleTranslatorDetailsChange =
    (field: keyof ClerkTranslatorBasicInformation) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  return (
    <ClerkTranslatorDetailsFields
      translator={translatorDetails}
      onFieldChange={(field: keyof ClerkTranslatorBasicInformation) =>
        handleTranslatorDetailsChange(field)
      }
      editDisabled={isViewMode}
      controlButtons={
        <ControlButtons
          onCancelBtnClick={handleCancelBtnClick}
          onEditBtnClick={handleEditBtnClick}
          onSaveBtnClick={handleSaveBtnClick}
          isViewMode={isViewMode}
        />
      }
    />
  );
};

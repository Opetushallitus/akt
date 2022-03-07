import EditIcon from '@mui/icons-material/Edit';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';

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
import {
  resetClerkTranslatorDetailsUpdate,
  updateClerkTranslatorDetails,
} from 'redux/actions/clerkTranslatorOverview';
import { showNotifierDialog, showNotifierToast } from 'redux/actions/notifier';
import {
  NOTIFIER_ACTION_CLERK_TRANSLATOR_DETAILS_CANCEL_UPDATE,
  NOTIFIER_ACTION_DO_NOTHING,
} from 'redux/actionTypes/notifier';
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

  // Local State
  const [translatorDetails, setTranslatorDetails] =
    useState(selectedTranslator);
  const [currentUIMode, setCurrentUIMode] = useState(UIMode.View);
  const prevTranslatorDetails = usePrevious(translatorDetails);
  const isViewMode = currentUIMode !== UIMode.EditTranslatorDetails;
  const resetLocalStateFromRedux = useCallback(() => {
    setTranslatorDetails(selectedTranslator);
  }, [selectedTranslator]);

  // I18n
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.clerkTranslatorOverview',
  });
  const translateCommon = useCommonTranslation();

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
      dispatch(resetClerkTranslatorDetailsUpdate);
      setCurrentUIMode(UIMode.View);
    } else if (
      translatorDetailsStatus === APIResponseStatus.Cancelled &&
      currentUIMode === UIMode.EditTranslatorDetails
    ) {
      // Flow was reset through the cancel dialog -> reset UI state.
      dispatch(resetClerkTranslatorDetailsUpdate);
      resetLocalStateFromRedux();
      setCurrentUIMode(UIMode.View);
    }
  }, [
    currentUIMode,
    dispatch,
    prevTranslatorDetails?.version,
    resetLocalStateFromRedux,
    selectedTranslator?.version,
    t,
    translatorDetailsStatus,
  ]);

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
    resetLocalStateFromRedux();
    setCurrentUIMode(UIMode.EditTranslatorDetails);
  };

  const openCancelDialog = () => {
    const dialog = Utils.createNotifierDialog(
      t('translatorDetails.cancelUpdateDialog.title'),
      Severity.Info,
      t('translatorDetails.cancelUpdateDialog.description'),
      [
        {
          title: translateCommon('back'),
          variant: Variant.Outlined,
          action: NOTIFIER_ACTION_DO_NOTHING,
        },
        {
          title: translateCommon('yes'),
          variant: Variant.Contained,
          action: NOTIFIER_ACTION_CLERK_TRANSLATOR_DETAILS_CANCEL_UPDATE,
        },
      ]
    );
    dispatch(showNotifierDialog(dialog));
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
          onCancelBtnClick={openCancelDialog}
          onEditBtnClick={handleEditBtnClick}
          onSaveBtnClick={handleSaveBtnClick}
          isViewMode={isViewMode}
        />
      }
    />
  );
};

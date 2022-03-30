import { useNavigate } from 'react-router-dom';

import { CustomButton } from 'components/elements/CustomButton';
import { LoadingProgressIndicator } from 'components/elements/LoadingProgressIndicator';
import { useAppTranslation, useCommonTranslation } from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { APIResponseStatus } from 'enums/api';
import { AppRoutes, Color, Severity, Variant } from 'enums/app';
import {
  resetNewClerkTranslatorDetails,
  resetNewClerkTranslatorRequestStatus,
  saveNewClerkTranslator,
} from 'redux/actions/clerkNewTranslator';
import { showNotifierDialog } from 'redux/actions/notifier';
import { NOTIFIER_ACTION_DO_NOTHING } from 'redux/actionTypes/notifier';
import { clerkNewTranslatorSelector } from 'redux/selectors/clerkNewTranslator';
import { NotifierUtils } from 'utils/notifier';

export const BottomControls = () => {
  // i18n
  const translateCommon = useCommonTranslation();
  const { t } = useAppTranslation({
    keyPrefix: 'akt.pages.clerkNewTranslatorPage',
  });

  const navigate = useNavigate();

  // Redux
  const { status, translator } = useAppSelector(clerkNewTranslatorSelector);
  const dispatch = useAppDispatch();

  const isLoading = status === APIResponseStatus.InProgress;

  // Action handlers
  const onCancel = () => {
    const notifier = NotifierUtils.createNotifierDialog(
      t('cancelAddNewTranslatorDialog.title'),
      Severity.Info,
      '',
      [
        {
          title: translateCommon('back'),
          variant: Variant.Outlined,
          action: NOTIFIER_ACTION_DO_NOTHING,
        },
        {
          title: translateCommon('yes'),
          variant: Variant.Contained,
          action: () => {
            dispatch(resetNewClerkTranslatorDetails);
            dispatch(resetNewClerkTranslatorRequestStatus);
            navigate(AppRoutes.ClerkHomePage);
          },
        },
      ]
    );

    dispatch(showNotifierDialog(notifier));
  };
  const onSave = () => {
    dispatch(saveNewClerkTranslator(translator));
  };

  const isSaveButtonDisabled = () => {
    if (
      isLoading ||
      !translator.firstName ||
      !translator.lastName ||
      translator.authorisations.length < 1
    ) {
      return true;
    }

    return false;
  };

  return (
    <div className="columns gapped flex-end">
      <CustomButton
        variant={Variant.Text}
        color={Color.Secondary}
        onClick={onCancel}
      >
        {translateCommon('cancel')}
      </CustomButton>
      <LoadingProgressIndicator isLoading={isLoading}>
        <CustomButton
          data-testid="clerk-new-translator-page__save-button"
          variant={Variant.Contained}
          color={Color.Secondary}
          onClick={onSave}
          disabled={isSaveButtonDisabled()}
        >
          {translateCommon('save')}
        </CustomButton>
      </LoadingProgressIndicator>
    </div>
  );
};

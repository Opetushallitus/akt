import { useNavigate } from 'react-router';

import { CustomButton } from 'components/elements/CustomButton';
import { useCommonTranslation } from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { AppRoutes, Color, Variant } from 'enums/app';
import {
  resetNewClerkTranslatorDetails,
  resetNewClerkTranslatorRequestStatus,
  saveNewClerkTranslator,
} from 'redux/actions/clerkNewTranslator';
import { clerkNewTranslatorSelector } from 'redux/selectors/clerkNewTranslator';

export const BottomControls = () => {
  // i18n
  const translateCommon = useCommonTranslation();

  // Redux
  const { translator } = useAppSelector(clerkNewTranslatorSelector);
  const dispatch = useAppDispatch();

  // Navigation
  const navigate = useNavigate();

  // Action handlers
  const onCancel = () => {
    dispatch(resetNewClerkTranslatorDetails);
    dispatch(resetNewClerkTranslatorRequestStatus);
    navigate(AppRoutes.ClerkHomePage);
  };
  const onSave = () => {
    dispatch(saveNewClerkTranslator(translator));
  };

  return (
    <div className="columns gapped flex-end">
      <CustomButton
        data-testid="clerk-new-translator-page__cancel-btn"
        variant={Variant.Text}
        color={Color.Secondary}
        onClick={onCancel}
      >
        {translateCommon('cancel')}
      </CustomButton>
      <CustomButton
        data-testid="clerk-new-translator-page__save-btn"
        variant={Variant.Contained}
        color={Color.Secondary}
        onClick={onSave}
      >
        {translateCommon('save')}
      </CustomButton>
    </div>
  );
};

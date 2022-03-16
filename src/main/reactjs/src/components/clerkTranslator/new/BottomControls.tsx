import { CustomButton } from 'components/elements/CustomButton';
import { useCommonTranslation } from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { Color, Variant } from 'enums/app';
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

  // Action handlers
  const onCancel = () => {
    dispatch(resetNewClerkTranslatorDetails);
    dispatch(resetNewClerkTranslatorRequestStatus);
  };
  const onSave = () => {
    dispatch(saveNewClerkTranslator(translator));
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
      <CustomButton
        variant={Variant.Contained}
        color={Color.Secondary}
        onClick={onSave}
      >
        {translateCommon('save')}
      </CustomButton>
    </div>
  );
};

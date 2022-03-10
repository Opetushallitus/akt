import EditIcon from '@mui/icons-material/Edit';

import { CustomButton } from 'components/elements/CustomButton';
import { useCommonTranslation } from 'configs/i18n';
import { Color, Variant } from 'enums/app';

export const ControlButtons = ({
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

import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';

import { CustomButton } from 'components/elements/CustomButton';
import { DatePicker } from 'components/elements/DatePicker';
import { H3 } from 'components/elements/Text';
import { useAppTranslation } from 'configs/i18n';
import { useAppDispatch } from 'configs/redux';
import { Color, Variant } from 'enums/app';
import { addMeetingDate } from 'redux/actions/addMeetingDate';

export const AddMeetingDate = () => {
  const [value, setValue] = useState<Date | null>(null);
  // i18n
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.addMeetingDate',
  });

  const dispatch = useAppDispatch();

  const handleOnClick = () => {
    dispatch(addMeetingDate(value as Date));
  };

  return (
    <div className="columns gapped">
      <div className="rows gapped-xs flex-grow-3">
        <H3>{t('header')}</H3>
        <div className="columns gapped">
          <DatePicker value={value} setValue={setValue} />
          <CustomButton
            data-testid="clerk-translator-overview__authorisation-details__add-btn"
            variant={Variant.Outlined}
            color={Color.Secondary}
            startIcon={<AddIcon />}
            disabled={value === null}
            onClick={handleOnClick}
          >
            {t('button.add')}
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

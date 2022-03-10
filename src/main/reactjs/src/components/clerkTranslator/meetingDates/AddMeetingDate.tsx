import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';

import { CustomButton } from 'components/elements/CustomButton';
import { DatePicker } from 'components/elements/DatePicker';
import { H3 } from 'components/elements/Text';
import { useAppTranslation } from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { Color, Variant } from 'enums/app';
import { addMeetingDate } from 'redux/actions/meetingDate';
import { meetingDatesSelector } from 'redux/selectors/meetingDate';
import { DateUtils } from 'utils/date';

export const AddMeetingDate = () => {
  const [value, setValue] = useState<string>('');
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.addMeetingDate',
  });

  const {
    meetingDates: { meetingDates },
  } = useAppSelector(meetingDatesSelector);

  const dispatch = useAppDispatch();

  const handleOnClick = () => {
    value && dispatch(addMeetingDate(new Date(value)));
  };

  const isAddButtonDisabled = () => {
    if (value) {
      const date = new Date(value);

      return meetingDates.some((meetingDate) =>
        DateUtils.isDatePartEqual(meetingDate.date, date)
      );
    }

    return true;
  };

  return (
    <div className="columns gapped">
      <div className="rows gapped flex-grow-3">
        <H3>{t('header')}</H3>
        <div className="columns gapped">
          <DatePicker
            value={value}
            setValue={setValue}
            label={t('datePicker.label')}
          />
          <CustomButton
            data-testid="clerk-translator-overview__authorisation-details__add-btn"
            variant={Variant.Outlined}
            color={Color.Secondary}
            startIcon={<AddIcon />}
            disabled={isAddButtonDisabled()}
            onClick={handleOnClick}
          >
            {t('buttons.add')}
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

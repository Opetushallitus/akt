import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';

import { CustomButton } from 'components/elements/CustomButton';
import { DatePicker } from 'components/elements/DatePicker';
import { H3 } from 'components/elements/Text';
import { useAppTranslation } from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { Color, Variant } from 'enums/app';
import { addMeetingDate } from 'redux/actions/meetingDate';
import { selectMeetingDatesByMeetingStatus } from 'redux/selectors/meetingDate';
import { DateUtils } from 'utils/date';

export const AddMeetingDate = () => {
  const [value, setValue] = useState<string>('');
  const { t } = useAppTranslation({
    keyPrefix: 'akt.pages.meetingDatesPage.addMeetingDate',
  });
  const { upcoming } = useAppSelector(selectMeetingDatesByMeetingStatus);

  const dispatch = useAppDispatch();

  const handleOnClick = () => {
    value &&
      dispatch(addMeetingDate(DateUtils.dateAtStartOfDay(new Date(value))));
  };

  const shouldDisableAddMeetingDateButton = () => {
    if (!value) {
      return true;
    } else {
      const date = DateUtils.dateAtStartOfDay(new Date(value));

      return upcoming.some(
        (upcomingDate) => upcomingDate.date.getTime() === date.getTime()
      );
    }
  };

  return (
    <div className="columns gapped">
      <div className="rows gapped-xs flex-grow-3">
        <H3>{t('header')}</H3>
        <div className="columns gapped">
          <DatePicker
            value={value}
            setValue={setValue}
            label={t('datePickerLabel')}
          />
          <CustomButton
            data-testid="clerk-translator-overview__authorisation-details__add-btn"
            variant={Variant.Outlined}
            color={Color.Secondary}
            startIcon={<AddIcon />}
            disabled={shouldDisableAddMeetingDateButton()}
            onClick={handleOnClick}
          >
            {t('button.add')}
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

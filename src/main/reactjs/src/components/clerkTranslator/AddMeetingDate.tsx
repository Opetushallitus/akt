import { DatePicker } from 'components/elements/DatePicker';
import { H3 } from 'components/elements/Text';
import { useAppTranslation } from 'configs/i18n';

export const AddMeetingDate = () => {
  // i18n
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.addMeetingDate',
  });

  return (
    <div className="columns gapped">
      <div className="rows gapped-xs flex-grow-3">
        <H3>{t('header')}</H3>
        <div className="columns gapped">
          <DatePicker />
        </div>
      </div>
    </div>
  );
};

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { ChangeEvent, useState } from 'react';

import { ComboBox, valueAsOption } from 'components/elements/ComboBox';
import { CustomButton } from 'components/elements/CustomButton';
import { CustomSwitch } from 'components/elements/CustomSwitch';
import { CustomTextField } from 'components/elements/CustomTextField';
import { DatePicker } from 'components/elements/DatePicker';
import {
  LanguageSelect,
  languageToComboBoxOption,
} from 'components/elements/LanguageSelect';
import { Text } from 'components/elements/Text';
import {
  useAppTranslation,
  useCommonTranslation,
  useKoodistoLanguagesTranslation,
} from 'configs/i18n';
import { Color, TextFieldVariant, Variant } from 'enums/app';
import { AuthorisationBasisEnum } from 'enums/clerkTranslator';
import { Authorisation, AuthorisationBasis } from 'interfaces/authorisation';
import { AutocompleteValue } from 'interfaces/components/combobox';
import { MeetingDate } from 'interfaces/meetingDate';
import { Utils } from 'utils';
import { AuthorisationUtils } from 'utils/authorisation';
import { DateUtils } from 'utils/date';

interface AddAuthorisationProps {
  meetingDates: Array<MeetingDate>;
  onNewAuthorisationAdd(authorisation: Authorisation): void;
}

export const AddAuthorisation = ({
  meetingDates,
  onNewAuthorisationAdd,
}: AddAuthorisationProps) => {
  const dayjs = DateUtils.dayjs();
  const meetingDateValues = meetingDates.map((m) => {
    return {
      value: m.date.toDateString(),
      label: DateUtils.formatOptionalDate(dayjs(m.date).toDate()),
    };
  });

  const [authorisation, setAuthorisation] = useState<Authorisation>({
    id: 0,
    version: 0,
    languagePair: { from: '', to: '' },
    basis: null as unknown as AuthorisationBasis,
    termBeginDate: undefined,
    termEndDate: undefined,
    permissionToPublish: true,
    diaryNumber: '',
    autDate: undefined,
  });

  const translateCommon = useCommonTranslation();
  const translateLanguage = useKoodistoLanguagesTranslation();
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.newAuthorisation',
  });

  const handleLanguageSelectChange =
    (fieldName: string) =>
    ({}, value: AutocompleteValue) => {
      setAuthorisation({
        ...authorisation,
        languagePair: {
          ...authorisation.languagePair,
          [fieldName]: value?.value,
        },
      });
    };

  const handleBasisChange = ({}, value: AutocompleteValue) => {
    setAuthorisation({
      ...authorisation,
      basis: value?.value as AuthorisationBasis,
    });
  };

  const handleTermBeginDateChange = ({}, value: AutocompleteValue) => {
    const PERIOD_OF_VALIDITY = 5;
    setAuthorisation({
      ...authorisation,
      termBeginDate: value?.value ? dayjs(value?.value).toDate() : undefined,
      termEndDate: value?.value
        ? dayjs(value?.value).add(PERIOD_OF_VALIDITY, 'year').toDate()
        : undefined,
    });
  };

  const handleAutDateChange = (value: string) => {
    setAuthorisation({
      ...authorisation,
      autDate: dayjs(value).toDate(),
    });
  };

  const handleSwitchValueChange = (value: boolean) => {
    setAuthorisation({
      ...authorisation,
      permissionToPublish: value,
    });
  };

  const handleDiaryNumberChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAuthorisation({
      ...authorisation,
      diaryNumber: event?.target.value,
    });
  };

  const getLanguageSelectValue = (language?: string) =>
    language ? languageToComboBoxOption(translateLanguage, language) : null;

  const getTermBeginDate = () => {
    return authorisation.termBeginDate
      ? {
          value: authorisation.termBeginDate.toDateString(),
          label: DateUtils.formatOptionalDate(authorisation.termBeginDate),
        }
      : null;
  };

  const isAddButtonDisabled = () => {
    const { languagePair, autDate: _ignored, ...otherProps } = authorisation;

    const isOtherPropsNotDefined = Object.values(otherProps).some(
      (p) => p === null || p === ''
    );
    const isLangPropsNotDefined =
      Utils.isEmptyString(languagePair.from) ||
      Utils.isEmptyString(languagePair.to);

    return isOtherPropsNotDefined || isLangPropsNotDefined;
  };

  return (
    <div className="rows gapped">
      <div className="add-authorisation__fields gapped align-items-end">
        <div className="rows gapped-xs">
          <Text>{t('languageSelect.title')}</Text>
          <div className="columns gapped">
            <LanguageSelect
              autoHighlight
              label={t('fieldLabels.from')}
              variant={TextFieldVariant.Outlined}
              languages={AuthorisationUtils.getKoodistoLangKeys()}
              excludedLanguage={authorisation.languagePair.to || undefined}
              value={getLanguageSelectValue(authorisation.languagePair.from)}
              onChange={handleLanguageSelectChange('from')}
            />
            <LanguageSelect
              autoHighlight
              label={t('fieldLabels.to')}
              variant={TextFieldVariant.Outlined}
              languages={AuthorisationUtils.getKoodistoLangKeys()}
              excludedLanguage={authorisation.languagePair.from || undefined}
              value={getLanguageSelectValue(authorisation.languagePair.to)}
              onChange={handleLanguageSelectChange('to')}
            />
          </div>
        </div>
        <ComboBox
          autoHighlight
          label={t('fieldLabels.basis')}
          values={Object.values(AuthorisationBasisEnum).map(valueAsOption)}
          value={
            authorisation.basis ? valueAsOption(authorisation.basis) : null
          }
          variant={TextFieldVariant.Outlined}
          onChange={handleBasisChange}
        />
        {authorisation.basis === AuthorisationBasisEnum.AUT && (
          <DatePicker
            label={t('fieldLabels.autDate')}
            setValue={handleAutDateChange}
          />
        )}
        <ComboBox
          autoHighlight
          label={t('fieldLabels.termBeginDate')}
          values={meetingDateValues}
          value={getTermBeginDate()}
          variant={TextFieldVariant.Outlined}
          onChange={handleTermBeginDateChange}
        />
        <CustomTextField
          label={t('fieldLabels.termEndDate')}
          value={DateUtils.formatOptionalDate(authorisation?.termEndDate)}
          disabled={true}
        />
        <CustomTextField
          label={t('fieldLabels.diaryNumber')}
          value={authorisation.diaryNumber}
          onChange={handleDiaryNumberChange}
        />
      </div>

      <div className="columns space-between">
        <div className="rows">
          <Text>{t('switch.canPublish')}</Text>
          <CustomSwitch
            value={authorisation.permissionToPublish}
            leftLabel={translateCommon('no')}
            rightLabel={translateCommon('yes')}
            onSwitchValueChange={handleSwitchValueChange}
          />
        </div>
        <CustomButton
          color={Color.Secondary}
          variant={Variant.Outlined}
          startIcon={<AddOutlinedIcon />}
          onClick={() => onNewAuthorisationAdd(authorisation)}
          disabled={isAddButtonDisabled()}
        >
          {t('buttons.add')}
        </CustomButton>
      </div>
    </div>
  );
};

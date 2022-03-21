import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { ChangeEvent, useEffect, useState } from 'react';

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
  onAuthorisationAdd(authorisation: Authorisation): void;
  addAuthorisationOutsideComponent?: boolean;
  setAddAuthorisationOutsideComponent?: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  onNewAuthorisationAdd(authorisation: Authorisation): void;
}

const newAuthorisation: Authorisation = {
  languagePair: { from: '', to: '' },
  basis: null as unknown as AuthorisationBasis,
  termBeginDate: undefined,
  termEndDate: undefined,
  permissionToPublish: true,
  diaryNumber: '',
  autDate: undefined,
};

export const AddAuthorisation = ({
  meetingDates,
  onAuthorisationAdd,
  addAuthorisationOutsideComponent,
  setAddAuthorisationOutsideComponent,
  onNewAuthorisationAdd,
}: AddAuthorisationProps) => {
  const dayjs = DateUtils.dayjs();
  const currentDate = dayjs();
  const availableMeetingDateValues = meetingDates
    .filter((m) => m.date.isAfter(currentDate, 'day'))
    .map((m) => {
      return {
        value: m.date.toISOString(),
        label: DateUtils.formatOptionalDate(dayjs(m.date)),
      };
    });

  const [authorisation, setAuthorisation] =
    useState<Authorisation>(newAuthorisation);

  const translateCommon = useCommonTranslation();
  const translateLanguage = useKoodistoLanguagesTranslation();
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.newAuthorisation',
  });

  useEffect(() => {
    if (addAuthorisationOutsideComponent) {
      onNewAuthorisationAdd(authorisation);
      setAddAuthorisationOutsideComponent &&
        setAddAuthorisationOutsideComponent(false);
    }
  }, [
    addAuthorisationOutsideComponent,
    authorisation,
    onNewAuthorisationAdd,
    setAddAuthorisationOutsideComponent,
  ]);

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
    const termBeginDate = value?.value ? dayjs(value?.value) : undefined;
    const termEndDate = termBeginDate?.add(PERIOD_OF_VALIDITY, 'year');
    setAuthorisation({
      ...authorisation,
      termBeginDate,
      termEndDate,
    });
  };

  const handleAutDateChange = (value: string) => {
    setAuthorisation({
      ...authorisation,
      autDate: dayjs(value),
    });
  };

  const handleSwitchValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAuthorisation({
      ...authorisation,
      permissionToPublish: event?.target.checked,
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
          value: authorisation.termBeginDate.toISOString(),
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

  const addAndResetAuthorisation = (authorisation: Authorisation) => {
    onAuthorisationAdd(authorisation);
    setAuthorisation(newAuthorisation);
  };

  return (
    <div className="rows gapped">
      <div className="add-authorisation__fields gapped align-items-start full-max-width">
        <div className="rows gapped-xs">
          <Text className="bold">{t('title.from')}</Text>
          <LanguageSelect
            autoHighlight
            label={t('fieldLabels.from')}
            variant={TextFieldVariant.Outlined}
            languages={AuthorisationUtils.getKoodistoLangKeys()}
            excludedLanguage={authorisation.languagePair.to || undefined}
            value={getLanguageSelectValue(authorisation.languagePair.from)}
            onChange={handleLanguageSelectChange('from')}
          />
        </div>
        <div className="rows gapped-xs">
          <Text className="bold">{t('title.to')}</Text>
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
        <div className="rows gapped-xs">
          <Text className="bold">{t('title.basis')}</Text>
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
        </div>
        <div className="rows gapped-xs">
          <Text className="bold">{t('title.autDate')}</Text>
          <DatePicker
            label={t('fieldLabels.autDate')}
            setValue={handleAutDateChange}
            disabled={authorisation.basis !== AuthorisationBasisEnum.AUT}
          />
        </div>
      </div>
      <div className="add-authorisation__fields gapped align-items-start">
        <div className="rows gapped-xs">
          <Text className="bold">{t('title.termBeginDate')}</Text>
          <ComboBox
            autoHighlight
            label={t('fieldLabels.termBeginDate')}
            values={availableMeetingDateValues}
            value={getTermBeginDate()}
            variant={TextFieldVariant.Outlined}
            onChange={handleTermBeginDateChange}
          />
        </div>
        <div className="rows gapped-xs">
          <Text className="bold">{t('title.termEndDate')}</Text>
          <CustomTextField
            label={t('fieldLabels.termEndDate')}
            value={DateUtils.formatOptionalDate(authorisation?.termEndDate)}
            disabled={true}
          />
        </div>
        <div className="rows gapped-xs">
          <Text className="bold">{t('title.diaryNumber')}</Text>
          <CustomTextField
            label={t('fieldLabels.diaryNumber')}
            value={authorisation.diaryNumber}
            onChange={handleDiaryNumberChange}
          />
        </div>
        <div className="rows gapped-xs">
          <Text className="bold">{t('switch.canPublish')}</Text>
          <CustomSwitch
            value={authorisation.permissionToPublish}
            leftLabel={translateCommon('no')}
            rightLabel={translateCommon('yes')}
            onChange={handleSwitchValueChange}
          />
        </div>
        {addAuthorisationOutsideComponent === undefined && (
          <CustomButton
            color={Color.Secondary}
            variant={Variant.Outlined}
            startIcon={<AddOutlinedIcon />}
            onClick={() => addAndResetAuthorisation(authorisation)}
            disabled={isAddButtonDisabled()}
          >
            {t('buttons.add')}
          </CustomButton>
        )}
      </div>
    </div>
  );
};

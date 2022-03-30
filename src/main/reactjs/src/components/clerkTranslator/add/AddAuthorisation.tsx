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
import { LoadingProgressIndicator } from 'components/elements/LoadingProgressIndicator';
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
  translatorId?: number;
  meetingDates: Array<MeetingDate>;
  isLoading?: boolean;
  onCancel: () => void;
  onAuthorisationAdd(authorisation: Authorisation): void;
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
  translatorId,
  meetingDates,
  isLoading,
  onAuthorisationAdd,
  onCancel,
}: AddAuthorisationProps) => {
  const dayjs = DateUtils.dayjs();
  const currentDate = dayjs();
  const availableMeetingDateValues = meetingDates
    .filter((m) => m.date.isBefore(currentDate, 'day'))
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
    const { languagePair, diaryNumber, autDate, ...otherProps } = authorisation;

    const isOtherPropsNotDefined = Object.values(otherProps).some((p) =>
      Utils.isEmptyString(p)
    );
    const isLangPropsNotDefined =
      Utils.isEmptyString(languagePair.from) ||
      Utils.isEmptyString(languagePair.to);

    const isDiaryNumberBlank = Utils.isBlankString(diaryNumber);

    const isAutDateNotDefinedOrInvalid =
      otherProps.basis === AuthorisationBasisEnum.AUT &&
      (!autDate || !dayjs(autDate).isValid());

    return (
      isOtherPropsNotDefined ||
      isLangPropsNotDefined ||
      isDiaryNumberBlank ||
      isAutDateNotDefinedOrInvalid
    );
  };

  const addAndResetAuthorisation = (authorisation: Authorisation) => {
    onAuthorisationAdd({
      ...authorisation,
      ...(translatorId && { translatorId }),
    });
    if (!translatorId) {
      setAuthorisation(newAuthorisation);
      onCancel();
    }
  };

  const testIdSuffix = 'add-authorisation-field';

  return (
    <>
      <div className="rows gapped">
        <div className="add-authorisation__fields gapped align-items-start full-max-width">
          <div className="rows gapped-xs">
            <Text className="bold">{t('fieldLabel.from')}</Text>
            <LanguageSelect
              data-testid={`${testIdSuffix}-from`}
              autoHighlight
              label={t('fieldPlaceholders.from')}
              variant={TextFieldVariant.Outlined}
              languages={AuthorisationUtils.getKoodistoLangKeys()}
              excludedLanguage={authorisation.languagePair.to || undefined}
              value={getLanguageSelectValue(authorisation.languagePair.from)}
              onChange={handleLanguageSelectChange('from')}
            />
          </div>
          <div className="rows gapped-xs">
            <Text className="bold">{t('fieldLabel.to')}</Text>
            <LanguageSelect
              data-testid={`${testIdSuffix}-to`}
              autoHighlight
              label={t('fieldPlaceholders.to')}
              variant={TextFieldVariant.Outlined}
              languages={AuthorisationUtils.getKoodistoLangKeys()}
              excludedLanguage={authorisation.languagePair.from || undefined}
              value={getLanguageSelectValue(authorisation.languagePair.to)}
              onChange={handleLanguageSelectChange('to')}
            />
          </div>
          <div className="rows gapped-xs">
            <Text className="bold">{t('fieldLabel.basis')}</Text>
            <ComboBox
              data-testid={`${testIdSuffix}-basis`}
              autoHighlight
              label={t('fieldPlaceholders.basis')}
              values={Object.values(AuthorisationBasisEnum).map(valueAsOption)}
              value={
                authorisation.basis ? valueAsOption(authorisation.basis) : null
              }
              variant={TextFieldVariant.Outlined}
              onChange={handleBasisChange}
            />
          </div>
          <div className="rows gapped-xs">
            <Text className="bold">{t('fieldLabel.autDate')}</Text>
            <DatePicker
              label={t('fieldPlaceholders.autDate')}
              setValue={handleAutDateChange}
              disabled={authorisation.basis !== AuthorisationBasisEnum.AUT}
              dataTestId={`${testIdSuffix}-autDate`}
            />
          </div>
        </div>
        <div className="add-authorisation__fields gapped align-items-start">
          <div className="rows gapped-xs">
            <Text className="bold">{t('fieldLabel.termBeginDate')}</Text>
            <ComboBox
              data-testid={`${testIdSuffix}-termBeginDate`}
              autoHighlight
              label={t('fieldPlaceholders.termBeginDate')}
              values={availableMeetingDateValues}
              value={getTermBeginDate()}
              variant={TextFieldVariant.Outlined}
              onChange={handleTermBeginDateChange}
            />
          </div>
          <div className="rows gapped-xs">
            <Text className="bold">{t('fieldLabel.termEndDate')}</Text>
            <CustomTextField
              data-testid={`${testIdSuffix}-termEndDate`}
              label={t('fieldPlaceholders.termEndDate')}
              value={DateUtils.formatOptionalDate(authorisation?.termEndDate)}
              disabled={true}
            />
          </div>
          <div className="rows gapped-xs">
            <Text className="bold">{t('fieldLabel.diaryNumber')}</Text>
            <CustomTextField
              data-testid={`${testIdSuffix}-diaryNumber`}
              label={t('fieldPlaceholders.diaryNumber')}
              value={authorisation.diaryNumber}
              onChange={handleDiaryNumberChange}
            />
          </div>
          <div className="rows gapped-xs">
            <Text className="bold">{t('switch.canPublish')}</Text>
            <CustomSwitch
              data-testid={`${testIdSuffix}-canPublish`}
              value={authorisation.permissionToPublish}
              leftLabel={translateCommon('no')}
              rightLabel={translateCommon('yes')}
              onChange={handleSwitchValueChange}
            />
          </div>
        </div>
      </div>
      <div className="columns gapped margin-top-lg flex-end">
        <CustomButton
          data-testid="add-authorisation-modal__cancel"
          className="margin-right-xs"
          onClick={onCancel}
          variant={Variant.Text}
          color={Color.Secondary}
        >
          {translateCommon('cancel')}
        </CustomButton>
        {isLoading ? (
          <LoadingProgressIndicator isLoading={isLoading}>
            <CustomButton
              data-testid="add-authorisation-modal__save"
              variant={Variant.Contained}
              color={Color.Secondary}
              onClick={() => addAndResetAuthorisation(authorisation)}
              disabled={isAddButtonDisabled()}
            >
              {translateCommon('add')}
            </CustomButton>
          </LoadingProgressIndicator>
        ) : (
          <CustomButton
            data-testid="add-authorisation-modal__save"
            variant={Variant.Contained}
            color={Color.Secondary}
            onClick={() => addAndResetAuthorisation(authorisation)}
            disabled={isAddButtonDisabled()}
          >
            {translateCommon('add')}
          </CustomButton>
        )}
      </div>
    </>
  );
};

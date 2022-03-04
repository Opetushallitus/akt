import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { ChangeEvent, SyntheticEvent, useState } from 'react';

import { ComboBox, valueAsOption } from 'components/elements/ComboBox';
import { CustomButton } from 'components/elements/CustomButton';
import { CustomSwitch } from 'components/elements/CustomSwitch';
import { CustomTextField } from 'components/elements/CustomTextField';
import { LanguageSelect } from 'components/elements/LanguageSelect';
import { H3, Text } from 'components/elements/Text';
import { useAppTranslation, useCommonTranslation } from 'configs/i18n';
import { Color, TextFieldVariant, Variant } from 'enums/app';
import { Authorisation, AuthorisationBasis } from 'interfaces/authorisation';
import { AutocompleteValue } from 'interfaces/components/combobox';
import { MeetingDate } from 'interfaces/meetingDate';
import { AuthorisationUtils } from 'utils/authorisation';

interface NewAuthorisationProps {
  meetingDates: Array<MeetingDate>;
  onNewAuthorisationAdd(authorisation: Authorisation): void;
}

export const NewAuthorisation = () => {
  const translateCommon = useCommonTranslation();

  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.newAuthorisation',
  });

  const [authorisation, setAuthorisation] = useState({
    langPair: { from: null, to: null },
    basis: null,
    diaryNumber: '',
    meetingDate: '',
    permissionToPublish: true,
  });

  const handleSwitchChange = (newValue: boolean) => (event: ChangeEvent) => {
    console.log(newValue);
  };

  const handleDiaryNumberChange = () => {
    console.log('new');
  };

  const handleLanguageSelectChange =
    (fieldName: string) =>
    (event: SyntheticEvent<Element, Event>, value: AutocompleteValue) => {
      setAuthorisation({
        ...authorisation,
        langPair: { ...authorisation.langPair, [fieldName]: value },
      });
    };

  const handleBasisChange = (
    event: SyntheticEvent<Element, Event>,
    value: AutocompleteValue
  ) => {
    console.log('value', value);
    setAuthorisation({
      ...authorisation,
      basis: value as AutocompleteValue,
    });
  };

  return (
    <div className="rows gapped">
      <div className="grid-columns gapped align-items-end">
        <div className="rows gapped-xs">
          <Text>{t('languageSelect.title')}</Text>
          <div className="columns gapped">
            <LanguageSelect
              autoHighlight
              label={t('fieldLabels.from')}
              variant={TextFieldVariant.Outlined}
              languages={AuthorisationUtils.getKoodistoLangKeys()}
              excludedLanguage={authorisation.langPair.to || undefined}
              value={authorisation.langPair.from}
              onChange={handleLanguageSelectChange('from')}
            />

            <LanguageSelect
              autoHighlight
              label={t('fieldLabels.to')}
              variant={TextFieldVariant.Outlined}
              languages={AuthorisationUtils.getKoodistoLangKeys()}
              excludedLanguage={authorisation.langPair.from || undefined}
              value={authorisation.langPair.to}
              onChange={handleLanguageSelectChange('to')}
            />
          </div>
        </div>
        <ComboBox
          autoHighlight
          label={t('fieldLabels.basis')}
          values={['AUT', 'KKT', 'VIR'].map(valueAsOption)}
          value={
            authorisation.basis ? valueAsOption(authorisation.basis) : null
          }
          variant={TextFieldVariant.Outlined}
          onChange={handleBasisChange}
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
            leftLabel={translateCommon('no')}
            rightLabel={translateCommon('yes')}
            onSwitchValueChange={handleSwitchChange}
          />
        </div>
        <CustomButton
          color={Color.Secondary}
          variant={Variant.Outlined}
          startIcon={<AddOutlinedIcon />}
        >
          {t('buttons.add')}
        </CustomButton>
      </div>
    </div>
  );
};

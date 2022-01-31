import { sortOptionsByLabels, ComboBox } from 'components/elements/ComboBox';
import { useKoodistoLanguagesTranslation } from 'configs/i18n';
import {
  ComboBoxProps,
  ComboBoxOption,
  AutoCompleteComboBox,
} from 'interfaces/combobox';
import { LanguageSelectProps } from 'interfaces/languageSelect';

const primaryLanguages = ['FI', 'SV'];

export const languageToComboBoxOption = (
  translate: (l: string) => string,
  lang: string
): ComboBoxOption => ({
  label: translate(lang),
  value: lang,
});

export const LanguageSelect = ({
  excludedLanguage,
  languages,
  ...rest
}: LanguageSelectProps &
  Omit<ComboBoxProps, 'values'> &
  AutoCompleteComboBox) => {
  // i18n
  const translateLanguage = useKoodistoLanguagesTranslation();

  // Helpers
  const filterSelectedLang = (
    excludedLanguage: string | undefined,
    valuesArray: Array<ComboBoxOption>,
    primaryLanguages: string[]
  ): Array<ComboBoxOption> => {
    const valuesArrayWithoutSelectedLang = valuesArray.filter(
      ({ value }) => value !== excludedLanguage
    );
    if (excludedLanguage && !primaryLanguages.includes(excludedLanguage)) {
      return valuesArrayWithoutSelectedLang.filter(({ value }) =>
        primaryLanguages.includes(value)
      );
    }

    return valuesArrayWithoutSelectedLang;
  };

  const values = languages.map((l) =>
    languageToComboBoxOption(translateLanguage, l)
  );

  const filteredValuesArray = filterSelectedLang(
    excludedLanguage,
    values,
    primaryLanguages
  );
  const optionValuesToShow = sortOptionsByLabels(filteredValuesArray);
  // Sort option value pairs into order set in primaryOptions parameter
  const primaryValues = optionValuesToShow
    .filter(({ value }) => {
      return primaryLanguages.indexOf(value) >= 0;
    })
    .sort((a, b) => {
      return (
        primaryLanguages.indexOf(a.value) - primaryLanguages.indexOf(b.value)
      );
    });

  // Merge sorted primaryOptions and sorted values
  const valuesToShow = [
    ...primaryValues,
    ...optionValuesToShow.filter((value) => !primaryValues.includes(value)),
  ];

  return <ComboBox {...rest} values={valuesToShow} />;
};
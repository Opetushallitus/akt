import { sortOptionsByLabels, ComboBox } from 'components/elements/ComboBox';
import {
  ComboBoxProps,
  ComboBoxOption,
  AutoCompleteComboBox,
} from 'interfaces/combobox';
import { LanguageSelectProps } from 'interfaces/languageSelect';

export const LanguageSelect = ({
  filterValue,
  values,
  ...rest
}: LanguageSelectProps & ComboBoxProps & AutoCompleteComboBox) => {
  const primaryLanguages = ['FI', 'SV'];
  const filterSelectedLang = (
    filterValue: string | undefined,
    valuesArray: Array<ComboBoxOption>,
    primaryLanguages: string[]
  ): Array<ComboBoxOption> => {
    const valuesArrayWithoutSelectedLang = valuesArray.filter(
      ({ value }) => value !== filterValue
    );
    if (filterValue) {
      if (!primaryLanguages.includes(filterValue)) {
        return valuesArrayWithoutSelectedLang.filter(({ value }) =>
          primaryLanguages.includes(value)
        );
      }
    }

    return valuesArrayWithoutSelectedLang;
  };

  const filteredValuesArray = filterSelectedLang(
    filterValue,
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

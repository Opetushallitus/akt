import { useState, SetStateAction, Dispatch, KeyboardEvent } from 'react';
import { TextField, InputAdornment, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import { H3 } from 'components/elements/Text';
import { ComboBox } from 'components/elements/ComboBox';
import {
  AutocompleteValue,
  PublicTranslatorComboBoxDetails,
} from 'interfaces/combobox';
import {
  useAppTranslation,
  useKoodistoLanguagesTranslation,
} from 'configs/i18n';
import { useAppSelector, useAppDispatch } from 'configs/redux';
import {
  addPublicTranslatorFilter,
  addPublicTranslatorFilterError,
  emptyPublicTranslatorFilters,
  emptySelectedTranslators,
  removePublicTranslatorFilterError,
} from 'redux/actions/publicTranslator';
import { publicTranslatorsSelector } from 'redux/selectors/publicTranslator';
import { Utils } from 'utils/index';
import { SearchFilter, KeyboardKey, Severity } from 'enums/app';
import { showNotifierToast } from 'redux/actions/notifier';

export const PublicTranslatorFilters = ({
  setShowTable,
}: {
  setShowTable: Dispatch<SetStateAction<boolean>>;
}) => {
  // I18
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.publicTranslatorFilters',
  });
  const translateLanguage = useKoodistoLanguagesTranslation();

  // State
  const defaultFiltersState = {
    fromLang: '',
    toLang: '',
    name: '',
    town: '',
  };
  const [filters, setFilters] = useState(defaultFiltersState);
  const defaultValuesState = {
    fromLang: null,
    toLang: null,
    name: '',
    town: null,
  };

  const [values, setValues] = useState(defaultValuesState);
  const [inputValues, setInputValues] = useState(defaultFiltersState);

  // Redux
  const dispatch = useAppDispatch();
  const {
    langs,
    towns,
    filters: reduxFilters,
  } = useAppSelector(publicTranslatorsSelector);

  const hasError = (fieldName: SearchFilter) => {
    return reduxFilters?.errors?.includes(fieldName);
  };

  // Handlers
  const handleSearchBtnClick = () => {
    const toast = Utils.createNotifierToast(
      Severity.Error,
      t('toasts.selectLanguagePair')
    );

    if (reduxFilters?.errors?.length) {
      // If there are already errors show them
      dispatch(showNotifierToast(toast));
    } else if (
      (filters.fromLang && !filters.toLang) ||
      (!filters.fromLang && filters.toLang)
    ) {
      // If one of the fields are not defined show an error
      const langFields = [SearchFilter.FromLang, SearchFilter.ToLang];
      langFields.forEach((field) => {
        if (!filters[field] && !hasError(field))
          dispatch(addPublicTranslatorFilterError(field));
      });
      dispatch(showNotifierToast(toast));
    } else {
      dispatch(addPublicTranslatorFilter(filters));
      setShowTable(true);
    }
  };

  const handleEmptyBtnClick = () => {
    setFilters(defaultFiltersState);
    setInputValues(defaultFiltersState);
    setValues(defaultValuesState);
    dispatch(emptyPublicTranslatorFilters);
    dispatch(emptySelectedTranslators);
    setShowTable(false);
  };

  const isEmptyBtnDisabled = () => {
    const { fromLang, toLang, town, name } = filters;

    return !(!!fromLang || !!toLang || !!name || !!town);
  };

  const handleComboboxInputChange =
    (inputName: string) =>
    (event: React.SyntheticEvent<Element, Event>, newInputValue: string) => {
      setInputValues({ ...inputValues, [inputName]: newInputValue });
    };

  const handleComboboxFilterChange =
    (filterName: SearchFilter) =>
    (
      event: React.SyntheticEvent<Element, Event>,
      value: AutocompleteValue,
      reason:
        | 'selectOption'
        | 'createOption'
        | 'removeOption'
        | 'blur'
        | 'clear'
    ) => {
      if (reason === 'clear') {
        setFilters({ ...filters, [filterName]: '' });
        setValues({ ...values, [filterName]: null });
        dispatch(removePublicTranslatorFilterError(filterName));
      } else {
        setFilters({ ...filters, [filterName]: value ? value[1] : '' });
        setValues({ ...values, [filterName]: value });
        dispatch(removePublicTranslatorFilterError(filterName));
      }
    };

  const handleTextFieldFilterChange =
    (filterName: string) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const target = event.target as HTMLInputElement;
      setFilters({ ...filters, [filterName]: target.value });
      setValues({ ...values, [filterName]: target.value });
    };

  const getOptionLabel = (option: AutocompleteValue): string => {
    const label = option ? option[0] : undefined;

    return label !== undefined ? label.toString() : '';
  };

  const getComboBoxAttributes = (
    fieldName: keyof PublicTranslatorComboBoxDetails
  ) => ({
    onInputChange: handleComboboxInputChange(fieldName),
    inputValue: inputValues[fieldName],
    value: values[fieldName],
  });

  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key == KeyboardKey.Enter) handleSearchBtnClick();
  };

  return (
    <div className="public-translator-filters">
      <div className="public-translator-filters__filter-box">
        <div className="public-translator-filters__filter">
          <H3>{t('languagePair.title')}</H3>
          <div className="public-translator-filters__filter__language-pair">
            <ComboBox
              dataTestId="public-translator-filters__from-language-combobox"
              sortByKeys
              autoHighlight
              {...getComboBoxAttributes('fromLang')}
              showError={hasError(SearchFilter.FromLang)}
              label={t('languagePair.fromPlaceholder')}
              id="filters-from-lang"
              variant="outlined"
              filterValue={filters.toLang}
              primaryOptions={['FI', 'SV']}
              getOptionLabel={getOptionLabel}
              values={Utils.createMapFromArray(langs.from, translateLanguage)}
              onChange={handleComboboxFilterChange(SearchFilter.FromLang)}
            />
            <ComboBox
              dataTestId="public-translator-filters__to-language-combobox"
              sortByKeys
              autoHighlight
              {...getComboBoxAttributes('toLang')}
              showError={hasError(SearchFilter.ToLang)}
              label={t('languagePair.toPlaceholder')}
              id="filters-to-lang"
              variant="outlined"
              filterValue={filters.fromLang}
              primaryOptions={['FI', 'SV']}
              getOptionLabel={getOptionLabel}
              values={Utils.createMapFromArray(langs.to, translateLanguage)}
              onChange={handleComboboxFilterChange(SearchFilter.ToLang)}
            />
          </div>
        </div>
        <div className="public-translator-filters__filter">
          <H3>{t('name.title')}</H3>
          <TextField
            data-testid="public-translator-filters__name-field"
            id="outlined-search"
            label={t('name.placeholder')}
            type="search"
            value={filters.name}
            onKeyUp={handleKeyUp}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onChange={handleTextFieldFilterChange(SearchFilter.Name)}
          />
        </div>
        <div className="public-translator-filters__filter">
          <H3> {t('town.title')}</H3>
          <ComboBox
            dataTestId="public-translator-filters__town-combobox"
            sortByKeys
            autoHighlight
            {...getComboBoxAttributes('town')}
            label={t('town.placeholder')}
            id="filters-town"
            values={Utils.createMapFromArray(towns)}
            variant="outlined"
            getOptionLabel={getOptionLabel}
            onChange={handleComboboxFilterChange(SearchFilter.Town)}
          />
        </div>
      </div>
      <div className="public-translator-filters__btn-box">
        <Button
          data-testid="public-translator-filters__empty-btn"
          color="secondary"
          variant="outlined"
          onClick={handleEmptyBtnClick}
          size="large"
          disabled={isEmptyBtnDisabled()}
        >
          {t('buttons.empty')}
        </Button>
        <Button
          data-testid="public-translator-filters__search-btn"
          color="secondary"
          variant="contained"
          size="large"
          onClick={handleSearchBtnClick}
        >
          {t('buttons.search')}
        </Button>
      </div>
    </div>
  );
};

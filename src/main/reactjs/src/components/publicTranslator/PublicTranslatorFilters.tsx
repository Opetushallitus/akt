import { useState, SetStateAction, Dispatch } from 'react';
import { TextField, InputAdornment, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import { H3 } from 'components/elements/Text';
import { ComboBox } from 'components/elements/ComboBox';
import { AutocompleteValue } from 'interfaces/combobox';
import { useAppTranslation } from 'configs/i18n';
import { useAppSelector, useAppDispatch } from 'configs/redux';
import {
  addPublicTranslatorFilter,
  emptyPublicTranslatorFilters,
} from 'redux/actions/publicTranslator';
import { publicTranslatorsSelector } from 'redux/selectors/publicTranslator';
import { Utils } from 'utils/index';

export const PublicTranslatorFilters = ({
  setShowTable,
}: {
  setShowTable: Dispatch<SetStateAction<boolean>>;
}) => {
  // I18
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.publicTranslatorFilters',
  });
  // State
  const [showFieldError, setShowFieldError] = useState(false);
  const defaultFiltersState = { fromLang: '', toLang: '', name: '', town: '' };
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
  const { langs, towns } = useAppSelector(publicTranslatorsSelector);

  const handleSearchBtnClick = () => {
    if (
      Utils.isEmptyString(filters.toLang) ||
      Utils.isEmptyString(filters.fromLang)
    ) {
      setShowFieldError(true);
    } else {
      dispatch(addPublicTranslatorFilter(filters));
      setShowFieldError(false);
      setShowTable(true);
    }
  };

  const handleEmptyBtnClick = () => {
    setFilters(defaultFiltersState);
    setInputValues(defaultFiltersState);
    setValues(defaultValuesState);
    dispatch(emptyPublicTranslatorFilters);
    setShowFieldError(false);
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
    (filterName: string) =>
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
      } else {
        setFilters({ ...filters, [filterName]: value ? value[1] : '' });
        setValues({ ...values, [filterName]: value });
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

  return (
    <div className="public-translator-filters">
      <div className="public-translator-filters__filter-box">
        <div className="public-translator-filters__filter">
          <H3>{t('languagePair.title')}</H3>
          <div className="public-translator-filters__filter__language-pair">
            <ComboBox
              dataTestId="public-translator-filters__from-language-combobox"
              sortByKeys
              showError={
                showFieldError && Utils.isEmptyString(filters.fromLang)
              }
              label={t('languagePair.fromPlaceholder')}
              helperText={t('languagePair.fromHelperText')}
              id="filters-from-lang"
              values={Utils.createMapFromArray(langs.from, t, 'languages')}
              value={values.fromLang}
              variant="outlined"
              filterValue={filters.toLang}
              primaryOptions={['fi', 'sv']}
              onChange={handleComboboxFilterChange('fromLang')}
              onInputChange={handleComboboxInputChange('fromLang')}
              inputValue={inputValues.fromLang}
              getOptionLabel={getOptionLabel}
            />
            <ComboBox
              dataTestId="public-translator-filters__to-language-combobox"
              sortByKeys
              showError={showFieldError && Utils.isEmptyString(filters.toLang)}
              label={t('languagePair.toPlaceholder')}
              helperText={t('languagePair.toHelperText')}
              id="filters-to-lang"
              values={Utils.createMapFromArray(langs.to, t, 'languages')}
              value={values.toLang}
              variant="outlined"
              filterValue={filters.fromLang}
              primaryOptions={['fi', 'sv']}
              onChange={handleComboboxFilterChange('toLang')}
              onInputChange={handleComboboxInputChange('toLang')}
              inputValue={inputValues.toLang}
              getOptionLabel={getOptionLabel}
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
            value={values.name}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onChange={handleTextFieldFilterChange('name')}
          />
        </div>
        <div className="public-translator-filters__filter">
          <H3> {t('town.title')}</H3>
          <ComboBox
            dataTestId="public-translator-filters__town-combobox"
            sortByKeys
            label={t('town.placeholder')}
            id="filters-town"
            values={Utils.createMapFromArray(towns)}
            value={values.town}
            variant="outlined"
            onChange={handleComboboxFilterChange('town')}
            onInputChange={handleComboboxInputChange('town')}
            inputValue={inputValues.town}
            getOptionLabel={getOptionLabel}
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

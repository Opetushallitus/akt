import SearchIcon from '@mui/icons-material/Search';
import {
  AppBar,
  Button,
  InputAdornment,
  TextField,
  Toolbar,
} from '@mui/material';
import {
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useRef,
  useState,
} from 'react';

import {
  ComboBox,
  sortOptionsByLabels,
  valueAsOption,
} from 'components/elements/ComboBox';
import { LanguageSelect } from 'components/elements/LanguageSelect';
import { Caption, H3 } from 'components/elements/Text';
import { ContactRequestButton } from 'components/publicTranslator/listing/ContactRequestButton';
import { useAppTranslation } from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import {
  Color,
  KeyboardKey,
  SearchFilter,
  Severity,
  TextFieldVariant,
  Variant,
} from 'enums/app';
import { useWindowProperties } from 'hooks/useWindowProperties';
import { AutocompleteValue } from 'interfaces/combobox';
import { PublicTranslatorFilterValues } from 'interfaces/publicTranslator';
import { showNotifierToast } from 'redux/actions/notifier';
import {
  addPublicTranslatorFilter,
  addPublicTranslatorFilterError,
  emptyPublicTranslatorFilters,
  emptySelectedTranslators,
  removePublicTranslatorFilterError,
} from 'redux/actions/publicTranslator';
import { publicTranslatorsSelector } from 'redux/selectors/publicTranslator';
import { Utils } from 'utils/index';

export const PublicTranslatorFilters = ({
  showTable,
  setShowTable,
}: {
  showTable: boolean;
  setShowTable: Dispatch<SetStateAction<boolean>>;
}) => {
  // I18
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.publicTranslatorFilters',
  });

  // State
  const defaultFiltersState = {
    fromLang: '',
    toLang: '',
    name: '',
    town: '',
    errors: [],
  };
  const [filters, setFilters] = useState(defaultFiltersState);
  const defaultValuesState: PublicTranslatorFilterValues = {
    fromLang: null,
    toLang: null,
    name: '',
    town: null,
  };

  const [values, setValues] = useState(defaultValuesState);
  const [inputValues, setInputValues] = useState(defaultFiltersState);
  const filtersGridRef = useRef<HTMLInputElement>(null);
  const { isPhone } = useWindowProperties();

  // Redux
  const dispatch = useAppDispatch();
  const {
    langs,
    towns,
    filters: reduxFilters,
  } = useAppSelector(publicTranslatorsSelector);

  const hasError = (fieldName: SearchFilter) => {
    return reduxFilters.errors.includes(fieldName);
  };

  // Handlers
  const handleSearchBtnClick = () => {
    const toast = Utils.createNotifierToast(
      Severity.Error,
      t('toasts.selectLanguagePair')
    );

    if (
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

  const scrollToSearch = () => {
    filtersGridRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEmptyBtnClick = () => {
    setFilters(defaultFiltersState);
    setInputValues(defaultFiltersState);
    setValues(defaultValuesState);
    dispatch(emptyPublicTranslatorFilters);
    dispatch(emptySelectedTranslators);
    scrollToSearch();
    setShowTable(false);
  };

  const isEmptyBtnDisabled = () => {
    const { fromLang, toLang, town, name } = filters;

    return !(!!fromLang || !!toLang || !!name || !!town);
  };

  const handleComboboxInputChange =
    (inputName: SearchFilter) =>
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
      } else {
        setFilters({ ...filters, [filterName]: value?.value || '' });
        setValues({ ...values, [filterName]: value });
      }
      dispatch(removePublicTranslatorFilterError(filterName));
    };

  const handleTextFieldFilterChange =
    (filterName: SearchFilter) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const target = event.target as HTMLInputElement;
      setFilters({ ...filters, [filterName]: target.value });
      setValues({ ...values, [filterName]: target.value });
    };

  const getComboBoxAttributes = (fieldName: SearchFilter) => ({
    onInputChange: handleComboboxInputChange(fieldName),
    inputValue: inputValues[fieldName],
    value: values[fieldName] as AutocompleteValue,
    autoHighlight: true,
    variant: TextFieldVariant.Outlined,
    onChange: handleComboboxFilterChange(fieldName),
  });

  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key == KeyboardKey.Enter) handleSearchBtnClick();
  };

  const renderPhoneBottomAppBar = () =>
    isPhone &&
    showTable && (
      <AppBar
        color={Color.Primary}
        className="public-translator-filters__app-bar"
      >
        <Toolbar className="space-around public-translator-filters__app-bar__tool-bar">
          <Button
            data-testid="public-translator-filters__empty-btn"
            color={Color.Secondary}
            variant={Variant.Outlined}
            onClick={handleEmptyBtnClick}
          >
            {t('buttons.newSearch')}
          </Button>
          <ContactRequestButton />
        </Toolbar>
      </AppBar>
    );

  return (
    <div className="public-translator-filters" ref={filtersGridRef}>
      <div className="public-translator-filters__filter-box">
        <div className="public-translator-filters__filter">
          <div className="columns gapped-xxs">
            <H3>{t('languagePair.title')}</H3>
            <Caption className="public-translator-filters__filter_">
              {t('captions.langPair')}
            </Caption>
          </div>
          <div className="public-translator-filters__filter__language-pair">
            <LanguageSelect
              data-testid="public-translator-filters__from-language-select"
              {...getComboBoxAttributes(SearchFilter.FromLang)}
              showError={hasError(SearchFilter.FromLang)}
              label={t('languagePair.fromPlaceholder')}
              id="filters-from-lang"
              excludedLanguage={filters.toLang}
              languages={langs.from}
            />
            <LanguageSelect
              data-testid="public-translator-filters__to-language-select"
              {...getComboBoxAttributes(SearchFilter.ToLang)}
              showError={hasError(SearchFilter.ToLang)}
              label={t('languagePair.toPlaceholder')}
              id="filters-to-lang"
              excludedLanguage={filters.fromLang}
              languages={langs.to}
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
            data-testid="public-translator-filters__town-combobox"
            {...getComboBoxAttributes(SearchFilter.Town)}
            label={t('town.placeholder')}
            id="filters-town"
            values={sortOptionsByLabels(towns.map(valueAsOption))}
          />
        </div>
      </div>
      <div className="public-translator-filters__btn-box">
        <Button
          data-testid="public-translator-filters__empty-btn"
          color={Color.Secondary}
          variant={Variant.Outlined}
          onClick={handleEmptyBtnClick}
          disabled={isEmptyBtnDisabled()}
        >
          {t('buttons.empty')}
        </Button>
        <Button
          data-testid="public-translator-filters__search-btn"
          color={Color.Secondary}
          variant={Variant.Contained}
          onClick={handleSearchBtnClick}
        >
          {t('buttons.search')}
        </Button>
      </div>
      {renderPhoneBottomAppBar()}
    </div>
  );
};

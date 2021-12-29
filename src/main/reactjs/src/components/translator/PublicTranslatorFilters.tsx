import { useState, ChangeEvent, SetStateAction, Dispatch } from 'react';
import {
  TextField,
  InputAdornment,
  SelectChangeEvent,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import { H3 } from 'components/elements/Text';
import { ComboBox } from 'components/elements/ComboBox';
import { useAppTranslation } from 'configs/i18n';
import { useAppSelector, useAppDispatch } from 'configs/redux';
import {
  addPublicTranslatorFilter,
  emptyPublicTranslatorFilters,
} from 'redux/actions/translatorDetails';
import { publicTranslatorsSelector } from 'redux/selectors/translatorDetails';
import { Utils } from 'utils/index';
import { ComboBoxValue } from 'interfaces/combobox';
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
    dispatch(emptyPublicTranslatorFilters);
    setShowFieldError(false);
    setShowTable(false);
  };

  const isEmptyBtnDisabled = () => {
    const { fromLang, toLang, town, name } = filters;
    return !(!!fromLang || !!toLang || !!name || !!town);
  };

  const handleFilterChange =
    (filterName: string) =>
    (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string
    ) => {
      console.log(newValue[1]);
      const eventValue = newValue[1];
      console.log(filters);
      setFilters({ ...filters, [filterName]: eventValue });
    };

  const getOptionLabel = (option: [ComboBoxValue, ComboBoxValue]): string => {
    const label = option[0];
    return label !== undefined ? label.toString() : '';
  };

  return (
    <div className="public-translator-filters">
      <div className="public-translator-filters__filter-box">
        <div className="public-translator-filters__filter">
          <H3>{t('languagePair.title')}</H3>
          <div className="public-translator-filters__filter__language-pair">
            <ComboBox
              showInputLabel
              sortByKeys
              disableClearable
              showError={
                showFieldError && Utils.isEmptyString(filters.fromLang)
              }
              label={t('languagePair.fromPlaceholder')}
              helperText={t('languagePair.fromHelperText')}
              id="filters-from-lang"
              values={Utils.createMapFromArray(langs.from, t, 'languages')}
              variant="outlined"
              value={filters.fromLang}
              filterValue={filters.toLang}
              primaryOptions={['fi', 'sv']}
              onChange={handleFilterChange('fromLang')}
              getOptionLabel={getOptionLabel}
            />
            <ComboBox
              showInputLabel
              sortByKeys
              disableClearable
              showError={showFieldError && Utils.isEmptyString(filters.toLang)}
              label={t('languagePair.toPlaceholder')}
              helperText={t('languagePair.toHelperText')}
              id="filters-to-lang"
              values={Utils.createMapFromArray(langs.to, t, 'languages')}
              variant="outlined"
              value={filters.toLang}
              filterValue={filters.fromLang}
              primaryOptions={['fi', 'sv']}
              onChange={handleFilterChange('toLang')}
              getOptionLabel={getOptionLabel}
            />
          </div>
        </div>
        <div className="public-translator-filters__filter">
          <H3>{t('name.title')}</H3>
          <TextField
            id="outlined-search"
            label={t('name.placeholder')}
            type="search"
            value={filters.name}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onChange={handleFilterChange('name')}
          />
        </div>
        <div className="public-translator-filters__filter">
          <H3> {t('town.title')}</H3>
          <ComboBox
            showInputLabel
            sortByKeys
            label={t('town.placeholder')}
            id="filters-town"
            values={Utils.createMapFromArray(towns)}
            variant="outlined"
            value={filters.town}
            onChange={handleFilterChange('town')}
            getOptionLabel={getOptionLabel}
          />
        </div>
      </div>
      <div className="public-translator-filters__btn-box">
        <Button
          color="secondary"
          variant="outlined"
          onClick={handleEmptyBtnClick}
          size="large"
          disabled={isEmptyBtnDisabled()}
        >
          {t('buttons.empty')}
        </Button>
        <Button
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

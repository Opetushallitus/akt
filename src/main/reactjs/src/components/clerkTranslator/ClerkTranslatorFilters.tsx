import { KeyboardEvent, useState } from 'react';
import { TextField, Button, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import {
  LanguageSelect,
  languageToAutocompleteValue,
} from 'components/elements/LanguageSelect';
import { H3 } from 'components/elements/Text';
import {
  useAppTranslation,
  useKoodistoLanguagesTranslation,
} from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { Variant, Color, KeyboardKey } from 'enums/app';
import { AuthorisationStatus } from 'enums/clerkTranslator';
import { ClerkTranslatorFilter } from 'interfaces/clerkTranslator';
import { AutocompleteValue } from 'interfaces/combobox';
import {
  addClerkTranslatorFilter,
  resetClerkTranslatorFilters,
} from 'redux/actions/clerkTranslator';
import {
  clerkTranslatorsSelector,
  selectTranslatorsByAuthorisationStatus,
} from 'redux/selectors/clerkTranslator';
import { ComboBox, valueAsOption } from 'components/elements/ComboBox';

export const RegisterControls = () => {
  const { authorised, expiring, expired } = useAppSelector(
    selectTranslatorsByAuthorisationStatus
  );
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.clerkTranslatorFilters.authorisationStatus',
  });
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector(clerkTranslatorsSelector);
  const filterByAuthorisationStatus = (status: AuthorisationStatus) => {
    dispatch(
      addClerkTranslatorFilter({ ...filters, authorisationStatus: status })
    );
  };
  const variantForStatus = (status: AuthorisationStatus) => {
    return status === filters.authorisationStatus
      ? Variant.Contained
      : Variant.Outlined;
  };

  const countsForStatuses = [
    { status: AuthorisationStatus.Authorised, count: authorised.length },
    { status: AuthorisationStatus.Expiring, count: expiring.length },
    { status: AuthorisationStatus.Expired, count: expired.length },
  ];

  return (
    <>
      {countsForStatuses.map(({ count, status }, i) => (
        <Button
          key={i}
          data-testid={`clerk-translator-filters__btn--${status}`}
          color={Color.Secondary}
          variant={variantForStatus(status)}
          onClick={() => filterByAuthorisationStatus(status)}
        >
          <div className="columns gapped">
            <div className="grow">{t(status)}</div>
            <div>{`(${count})`}</div>
          </div>
        </Button>
      ))}
    </>
  );
};

export const ListingFilters = () => {
  // i18n
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.clerkTranslatorFilters',
  });
  const translateLanguage = useKoodistoLanguagesTranslation();

  // local state
  const [name, setName] = useState('');
  // redux
  const dispatch = useAppDispatch();
  const { filters, langs, towns } = useAppSelector(clerkTranslatorsSelector);
  const handleFilterChange =
    (filter: keyof ClerkTranslatorFilter) =>
    (event: React.SyntheticEvent<Element, Event>, value: AutocompleteValue) => {
      dispatch(
        addClerkTranslatorFilter({ ...filters, [filter]: value?.value })
      );
    };
  const handleEnterKeyPress =
    (filter: keyof ClerkTranslatorFilter, value: string) =>
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key == KeyboardKey.Enter) {
        dispatch(
          addClerkTranslatorFilter({
            ...filters,
            [filter]: value ? value : null,
          })
        );
      }
    };

  return (
    <div className="columns gapped">
      <div className="rows">
        <H3>{t('languagePair.title')}</H3>
        <div className="columns gapped">
          <LanguageSelect
            autoHighlight
            label={t('languagePair.fromPlaceholder')}
            filterValue={filters.toLang || ''}
            value={
              filters.fromLang
                ? languageToAutocompleteValue(
                    translateLanguage,
                    filters.fromLang
                  )
                : null
            }
            languages={langs.from}
            variant={Variant.Outlined}
            onChange={handleFilterChange('fromLang')}
          />
          <LanguageSelect
            autoHighlight
            label={t('languagePair.toPlaceholder')}
            filterValue={filters.fromLang || ''}
            value={
              filters.toLang
                ? languageToAutocompleteValue(translateLanguage, filters.toLang)
                : null
            }
            languages={langs.to}
            variant={Variant.Outlined}
            onChange={handleFilterChange('toLang')}
          />
        </div>
      </div>
      <div className="rows">
        <H3>{t('name.title')}</H3>
        <TextField
          placeholder={t('name.placeholder')}
          type="search"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
          onKeyUp={handleEnterKeyPress('name', name)}
        />
      </div>
      <div className="rows">
        <H3>{t('town.title')}</H3>
        <ComboBox
          autoHighlight
          label={t('town.placeholder')}
          values={towns.map(valueAsOption)}
          value={filters.town ? valueAsOption(filters.town) : null}
          variant={Variant.Outlined}
          onChange={handleFilterChange('town')}
        />
      </div>
      <div className="rows">
        <H3>{t('authorisationBasis.title')}</H3>
        <ComboBox
          autoHighlight
          //{...getComboBoxAttributes(SearchFilter.Town)}
          label={t('authorisationBasis.placeholder')}
          values={['AUT', 'KKT', 'VIR'].map(valueAsOption)}
          value={
            filters.authorisationBasis
              ? valueAsOption(filters.authorisationBasis)
              : null
          }
          variant={Variant.Outlined}
          onChange={handleFilterChange('authorisationBasis')}
        />
      </div>
      <div className="grow" />
      <div className="rows">
        <Button
          color={Color.Secondary}
          variant={Variant.Outlined}
          onClick={() => dispatch(resetClerkTranslatorFilters)}
        >
          {t('buttons.empty')}
        </Button>
      </div>
    </div>
  );
};

import SearchIcon from '@mui/icons-material/Search';
import { Button, InputAdornment } from '@mui/material';
import { useEffect, useState } from 'react';

import { ComboBox, valueAsOption } from 'components/elements/ComboBox';
import {
  LanguageSelect,
  languageToComboBoxOption,
} from 'components/elements/LanguageSelect';
import { H3 } from 'components/elements/Text';
import { TextBox } from 'components/elements/TextBox';
import {
  useAppTranslation,
  useKoodistoLanguagesTranslation,
} from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { Color, TextFieldVariant, Variant } from 'enums/app';
import { AuthorisationStatus } from 'enums/clerkTranslator';
import { useDebouncedValue } from 'hooks/useDebouncedValue';
import { ClerkTranslatorFilter } from 'interfaces/clerkTranslator';
import { AutocompleteValue } from 'interfaces/combobox';
import {
  resetClerkTranslatorFilters,
  setClerkTranslatorFilters,
} from 'redux/actions/clerkTranslator';
import {
  clerkTranslatorsSelector,
  selectTranslatorsByAuthorisationStatus,
} from 'redux/selectors/clerkTranslator';

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
    dispatch(setClerkTranslatorFilters({ authorisationStatus: status }));
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

export const ClerkTranslatorFilters = () => {
  // i18n
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.clerkTranslatorFilters',
  });
  const translateLanguage = useKoodistoLanguagesTranslation();
  const getLanguageSelectValue = (language?: string) =>
    language ? languageToComboBoxOption(translateLanguage, language) : null;

  // redux
  const dispatch = useAppDispatch();
  const { filters, langs, towns } = useAppSelector(clerkTranslatorsSelector);
  const handleFilterChange =
    (filter: keyof ClerkTranslatorFilter) =>
    (event: React.SyntheticEvent<Element, Event>, value: AutocompleteValue) => {
      dispatch(setClerkTranslatorFilters({ [filter]: value?.value }));
    };

  // debounce on input to name filter
  const [name, setName] = useState('');
  const debouncedName = useDebouncedValue(name, 300);
  useEffect(() => {
    dispatch(
      setClerkTranslatorFilters({
        name: debouncedName ? debouncedName : undefined,
      })
    );
  }, [debouncedName, dispatch]);

  return (
    <div className="columns gapped">
      <div className="rows">
        <H3>{t('languagePair.title')}</H3>
        <div className="columns gapped">
          <LanguageSelect
            autoHighlight
            data-testid="clerk-translator-filters__from-lang"
            label={t('languagePair.fromPlaceholder')}
            excludedLanguage={filters.toLang}
            value={getLanguageSelectValue(filters.fromLang)}
            languages={langs.from}
            variant={TextFieldVariant.Outlined}
            onChange={handleFilterChange('fromLang')}
          />
          <LanguageSelect
            autoHighlight
            data-testid="clerk-translator-filters__to-lang"
            label={t('languagePair.toPlaceholder')}
            excludedLanguage={filters.fromLang}
            value={getLanguageSelectValue(filters.toLang)}
            languages={langs.to}
            variant={TextFieldVariant.Outlined}
            onChange={handleFilterChange('toLang')}
          />
        </div>
      </div>
      <div className="rows">
        <H3>{t('name.title')}</H3>
        <TextBox
          data-testid="clerk-translator-filters__name"
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
        />
      </div>
      <div className="rows">
        <H3>{t('town.title')}</H3>
        <ComboBox
          autoHighlight
          data-testid="clerk-translator-filters__town"
          label={t('town.placeholder')}
          values={towns.map(valueAsOption)}
          value={filters.town ? valueAsOption(filters.town) : null}
          variant={TextFieldVariant.Outlined}
          onChange={handleFilterChange('town')}
        />
      </div>
      <div className="rows">
        <H3>{t('authorisationBasis.title')}</H3>
        <ComboBox
          autoHighlight
          data-testid="clerk-translator-filters__authorisation-basis"
          label={t('authorisationBasis.placeholder')}
          values={['AUT', 'KKT', 'VIR'].map(valueAsOption)}
          value={
            filters.authorisationBasis
              ? valueAsOption(filters.authorisationBasis)
              : null
          }
          variant={TextFieldVariant.Outlined}
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

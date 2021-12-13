import { createSelector } from 'reselect';

import { RootState } from 'configs/redux';
import {
  PublicTranslatorFilter,
  TranslatorDetails,
} from 'interfaces/translator';

export const publicTranslatorsSelector = (state: RootState) =>
  state.translatorDetails;

export const selectFilteredPublicTranslators = createSelector(
  (state: RootState) => state.translatorDetails.translators,
  (state: RootState) => state.translatorDetails.filters,
  (translators, filters) => {
    const filteredArray = translators
      .filter((t) => filterByLanguagePair(t, filters))
      .filter((t) => t.town.toLowerCase().includes(filters.town.toLowerCase()))
      .filter((t) => filterByName(t, filters));

    return filteredArray;
  }
);

// Helpers
const filterByLanguagePair = (
  publicTranslator: TranslatorDetails,
  filters: PublicTranslatorFilter
) => {
  return publicTranslator.languagePairs.find(
    (l) =>
      l.from.toLowerCase() === filters.fromLang.toLowerCase() &&
      l.to.toLowerCase() === filters.toLang.toLowerCase()
  );
};

const filterByName = (
  publicTranslator: TranslatorDetails,
  filters: PublicTranslatorFilter
) => {
  const isNameIncluded =
    `${publicTranslator.firstName} ${publicTranslator.lastName}`
      .toLowerCase()
      .includes(filters.name.toLowerCase());

  return isNameIncluded;
};

import { createSelector } from 'reselect';

import { RootState } from 'configs/redux';
import {
  PublicTranslatorFilter,
  PublicTranslator,
} from 'interfaces/translator';

export const publicTranslatorsSelector = (state: RootState) =>
  state.publicTranslator;

export const selectFilteredPublicTranslators = createSelector(
  (state: RootState) => state.publicTranslator.translators,
  (state: RootState) => state.publicTranslator.filters,
  (translators, filters) => {
    const filteredArray = translators
      .filter((t) => filterByLanguagePair(t, filters))
      .filter((t) => t.town.toLowerCase().includes(filters.town.toLowerCase()))
      .filter((t) => filterByName(t, filters));

    return filteredArray;
  }
);

export const selectedPublicTranslatorsForLanguagePair = createSelector(
  (state: RootState) => state.publicTranslator.selectedTranslators,
  (state: RootState) => state.publicTranslator.translators,
  (state: RootState) => state.publicTranslator.filters,
  (selectedTranslators, translators, filters) => {
    const selectedIds = new Set(selectedTranslators);
    const filtered = translators
      .filter(({ id }) => selectedIds.has(id))
      .filter((t) => filterByLanguagePair(t, filters));
    return filtered;
  }
);

// Helpers
const filterByLanguagePair = (
  publicTranslator: PublicTranslator,
  filters: PublicTranslatorFilter
) => {
  return publicTranslator.languagePairs.find(
    (l) =>
      l.from.toLowerCase() === filters.fromLang.toLowerCase() &&
      l.to.toLowerCase() === filters.toLang.toLowerCase()
  );
};

const filterByName = (
  publicTranslator: PublicTranslator,
  filters: PublicTranslatorFilter
) => {
  const nameCombs = [
    `${publicTranslator.firstName} ${publicTranslator.lastName}`,
    `${publicTranslator.lastName} ${publicTranslator.firstName}`,
  ];
  const isNameIncluded = nameCombs.some((name) =>
    name.toLowerCase().includes(filters.name.toLowerCase().trim())
  );

  return isNameIncluded;
};

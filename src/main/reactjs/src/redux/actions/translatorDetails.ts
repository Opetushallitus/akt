import { PublicTranslatorFilter } from 'interfaces/translator';
import {
  TRANSLATOR_DETAILS_LOAD,
  TRANSLATOR_DETAILS_ADD_SELECTED,
  TRANSLATOR_DETAILS_REMOVE_SELECTED,
  TRANSLATOR_DETAILS_ADD_FILTERS,
  TRANSLATOR_DETAILS_EMPTY_FILTERS,
} from 'redux/actionTypes/translatorDetails';

export const loadTranslatorDetails = {
  type: TRANSLATOR_DETAILS_LOAD,
};

export const addSelectedTranslator = (index: number) => ({
  type: TRANSLATOR_DETAILS_ADD_SELECTED,
  index,
});

export const removeSelectedTranslator = (index: number) => ({
  type: TRANSLATOR_DETAILS_REMOVE_SELECTED,
  index,
});

export const addPublicTranslatorFilter = (filters: PublicTranslatorFilter) => ({
  type: TRANSLATOR_DETAILS_ADD_FILTERS,
  filters,
});

export const emptyPublicTranslatorFilters = {
  type: TRANSLATOR_DETAILS_EMPTY_FILTERS,
};

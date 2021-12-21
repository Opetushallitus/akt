import { PublicTranslatorFilter } from 'interfaces/translator';
import {
  PUBLIC_TRANSLATOR_LOAD,
  PUBLIC_TRANSLATOR_ADD_SELECTED,
  PUBLIC_TRANSLATOR_REMOVE_SELECTED,
  PUBLIC_TRANSLATOR_ADD_FILTERS,
  PUBLIC_TRANSLATOR_EMPTY_FILTERS,
} from 'redux/actionTypes/publicTranslator';

export const loadPublicTranslators = {
  type: PUBLIC_TRANSLATOR_LOAD,
};

export const addSelectedTranslator = (index: number) => ({
  type: PUBLIC_TRANSLATOR_ADD_SELECTED,
  index,
});

export const removeSelectedTranslator = (index: number) => ({
  type: PUBLIC_TRANSLATOR_REMOVE_SELECTED,
  index,
});

export const addPublicTranslatorFilter = (filters: PublicTranslatorFilter) => ({
  type: PUBLIC_TRANSLATOR_ADD_FILTERS,
  filters,
});

export const emptyPublicTranslatorFilters = {
  type: PUBLIC_TRANSLATOR_EMPTY_FILTERS,
};

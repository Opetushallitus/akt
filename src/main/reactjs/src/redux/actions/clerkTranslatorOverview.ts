import { ClerkTranslator } from 'interfaces/clerkTranslator';
import {
  CLERK_TRANSLATOR_OVERVIEW_LOAD,
  CLERK_TRANSLATOR_OVERVIEW_LOAD_BY_FETCHING_ALL_TRANSLATORS,
  CLERK_TRANSLATOR_OVERVIEW_LOADING,
  CLERK_TRANSLATOR_OVERVIEW_REMOVE,
  CLERK_TRANSLATOR_OVERVIEW_UPDATE_TRANSLATOR_DETAILS,
} from 'redux/actionTypes/clerkTranslatorOverview';

export const updateClerkTranslatorDetails = (
  updatedTranslator: ClerkTranslator
) => ({
  type: CLERK_TRANSLATOR_OVERVIEW_UPDATE_TRANSLATOR_DETAILS,
  updatedTranslator,
});

export const loadClerkTranslatorOverviewByFetchingAllTranslators = (
  id: number
) => ({
  type: CLERK_TRANSLATOR_OVERVIEW_LOAD_BY_FETCHING_ALL_TRANSLATORS,
  id,
});

export const loadClerkTranslatorOverview = (
  selectedTranslator: ClerkTranslator
) => ({
  type: CLERK_TRANSLATOR_OVERVIEW_LOAD,
  selectedTranslator,
});

export const startLoadingClerkTranslatorOverview = {
  type: CLERK_TRANSLATOR_OVERVIEW_LOADING,
};

export const removeClerkTranslatorOverview = {
  type: CLERK_TRANSLATOR_OVERVIEW_REMOVE,
};

import { ClerkTranslator } from 'interfaces/clerkTranslator';
import {
  CLERK_TRANSLATOR_OVERVIEW_DELETE_AUTHORISATION,
  CLERK_TRANSLATOR_OVERVIEW_FETCH,
  CLERK_TRANSLATOR_OVERVIEW_LOAD,
  CLERK_TRANSLATOR_OVERVIEW_LOADING,
  CLERK_TRANSLATOR_OVERVIEW_RESET_UPDATE,
  CLERK_TRANSLATOR_OVERVIEW_UPDATE_TRANSLATOR_DETAILS,
} from 'redux/actionTypes/clerkTranslatorOverview';

export const updateClerkTranslatorDetails = (translator: ClerkTranslator) => ({
  type: CLERK_TRANSLATOR_OVERVIEW_UPDATE_TRANSLATOR_DETAILS,
  translator,
});

export const fetchClerkTranslatorOverview = (id: number) => ({
  type: CLERK_TRANSLATOR_OVERVIEW_FETCH,
  id,
});

export const loadClerkTranslatorOverview = (translator: ClerkTranslator) => ({
  type: CLERK_TRANSLATOR_OVERVIEW_LOAD,
  translator,
});

export const resetClerkTranslatorDetailsUpdate = {
  type: CLERK_TRANSLATOR_OVERVIEW_RESET_UPDATE,
};

export const startLoadingClerkTranslatorOverview = {
  type: CLERK_TRANSLATOR_OVERVIEW_LOADING,
};

export const deleteAuthorisation = (authorisationId: number) => ({
  type: CLERK_TRANSLATOR_OVERVIEW_DELETE_AUTHORISATION,
  authorisationId,
});

import { AddAuthorisation } from 'interfaces/authorisation';
import { CLERK_TRANSLATOR_ADD_AUTHORISATION } from 'redux/actionTypes/authorisation';

export const addAuthorisation = (authorisation: AddAuthorisation) => ({
  type: CLERK_TRANSLATOR_ADD_AUTHORISATION,
  authorisation,
});

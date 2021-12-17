import { ContactRequest } from 'interfaces/contactRequest';
import {
  CONTACT_REQUEST_RESET,
  CONTACT_REQUEST_SEND,
  CONTACT_REQUEST_SET,
} from 'redux/actionTypes/contactRequest';

export const setContactRequest = (request: ContactRequest) => ({
  type: CONTACT_REQUEST_SET,
  request,
});

export const sendContactRequest = (request: ContactRequest) => ({
  type: CONTACT_REQUEST_SEND,
  request,
});

export const resetContactRequest = { type: CONTACT_REQUEST_RESET };

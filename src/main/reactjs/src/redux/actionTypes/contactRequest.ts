import { Action } from 'redux';

import { ContactRequest } from 'interfaces/contactRequest';

export const CONTACT_REQUEST_SET = 'CONTACT_REQUEST/SET';
export const CONTACT_REQUEST_RESET = 'CONTACT_REQEUEST/RESET';
export const CONTACT_REQUEST_SEND = 'CONTACT_REQUEST/SEND';
export const CONTACT_REQUEST_SUCCESS = 'CONTACT_REQUEST/SUCCESS';
export const CONTACT_REQUEST_ERROR = 'CONTACT_REQUEST/ERROR';

export type ContactRequestActionType = {
  type:
    | typeof CONTACT_REQUEST_SEND
    | typeof CONTACT_REQUEST_SET
    | typeof CONTACT_REQUEST_RESET;
  request: ContactRequest;
};

export function isContactRequestSendAction(
  action: Action
): action is ContactRequestActionType {
  return (
    action.type == CONTACT_REQUEST_SEND ||
    action.type == CONTACT_REQUEST_SET ||
    action.type == CONTACT_REQUEST_RESET
  );
}
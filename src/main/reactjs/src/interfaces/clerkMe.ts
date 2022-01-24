import { Action } from 'redux';

import { APIResponseStatus } from 'enums/api';

export interface ClerkMe {
  uid: string;
  oid: string;
  firstName: string;
  lastName: string;
}

export interface ClerkMeAPIResponse extends ClerkMe {
  groups: Array<string>;
  roles: string;
  lang: string;
}

export interface ClerkMeAction extends Action {
  clerkInfo: ClerkMe;
}

export interface ClerkMeState extends ClerkMe {
  status: APIResponseStatus;
  isAuthenticated: boolean;
}

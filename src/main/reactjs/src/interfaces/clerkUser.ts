import { Action } from 'redux';

import { APIResponseStatus } from 'enums/api';

export interface ClerkUser {
  uid: string;
  oid: string;
  firstName: string;
  lastName: string;
}

export interface ClerkUserAPIResponse extends ClerkUser {
  groups: Array<string>;
  roles: string;
  lang: string;
}

export interface ClerkUserAction extends Action {
  clerkUser: ClerkUser;
}

export interface ClerkUserState extends ClerkUser {
  status: APIResponseStatus;
  isAuthenticated: boolean;
}

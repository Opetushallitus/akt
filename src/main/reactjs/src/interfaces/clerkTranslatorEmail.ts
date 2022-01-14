import { Action } from 'redux';

import { APIResponseStatus } from 'enums/api';
import { AppRoutes } from 'enums/app';

export interface ClerkTranslatorEmail {
  subject: string;
  body: string;
}

export interface ClerkTranslatorEmailState {
  status: APIResponseStatus;
  email: ClerkTranslatorEmail;
  recipients: Array<number>;
  redirect?: AppRoutes;
}

export interface ClerkTranslatorEmailAction extends Action<string> {
  email: Partial<ClerkTranslatorEmail>;
  recipientIds: Array<number>;
  redirect?: AppRoutes;
}

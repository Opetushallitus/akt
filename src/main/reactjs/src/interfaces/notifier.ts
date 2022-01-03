import { Action } from 'redux';

import {
  NotifierSeverity,
  NotifierTypes,
  NotifierButtonVariant,
} from 'enums/app';

export interface NotifierButtonAction {
  title: string;
  variant: `${NotifierButtonVariant}`;
  action: string;
  payload?: unknown;
}

export interface Notifier {
  id: string;
  type: `${NotifierTypes}`;
  severity: `${NotifierSeverity}`;
  title: string;
  description: string;
  timeOut?: number;
  actions?: Array<NotifierButtonAction>;
}

export interface NotifierState {
  dialogs: Array<Notifier>;
  toasts: Array<Notifier>;
}

export interface NotifierAction extends Action {
  id?: string;
  notifier?: Notifier;
  toasts?: Notifier;
}

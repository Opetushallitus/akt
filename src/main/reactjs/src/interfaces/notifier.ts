import { Action } from 'redux';

import { Severity, NotifierTypes, Variant } from 'enums/app';

export interface NotifierButtonAction {
  title: string;
  variant: `${Variant}`;
  action: string;
  payload?: unknown;
}

export interface Notifier {
  id: string;
  severity: `${Severity}`;
  title: string;
  description: string;
  timeOut?: number;
  actions?: Array<NotifierButtonAction>;
}

export interface Toast extends Notifier {
  type: NotifierTypes.Toast;
}

export interface Dialog extends Notifier {
  type: NotifierTypes.Dialog;
}

export interface NotifierState {
  dialogs: Array<Dialog>;
  toasts: Array<Toast>;
}

export interface NotifierAction extends Action {
  id?: string;
  notifier?: Notifier;
  toasts?: Notifier;
}

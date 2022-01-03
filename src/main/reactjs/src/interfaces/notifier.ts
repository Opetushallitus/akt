import { Action } from 'redux';

type NotifierType = 'dialog' | 'toast';
type Severity = 'error' | 'info' | 'success' | 'warning';
type Variant = 'text' | 'outlined' | 'contained' | undefined;

export interface NotifierButtonAction {
  title: string;
  variant: Variant;
  action: string;
  payload?: unknown;
}

export interface Notifier {
  id: string;
  type: NotifierType;
  severity: Severity;
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

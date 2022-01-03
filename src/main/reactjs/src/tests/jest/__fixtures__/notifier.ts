import { Utils } from 'utils';
import { NotifierSeverity, NotifierTypes } from 'enums/app';

const toasts = [
  Utils.createNotifierToast(
    'Test Title 1',
    NotifierTypes.Toast,
    NotifierSeverity.Error,
    'Test Message 1'
  ),
  Utils.createNotifierToast(
    'Test Title 2',
    NotifierTypes.Toast,
    NotifierSeverity.Info,
    'Test Message 2'
  ),
  Utils.createNotifierToast(
    'Test Title 3',
    NotifierTypes.Toast,
    NotifierSeverity.Success,
    'Test Message 3'
  ),
];

const dialogs = [
  Utils.createNotifierToast(
    'Test Title 1',
    NotifierTypes.Toast,
    NotifierSeverity.Error,
    'Test Message 1'
  ),
  Utils.createNotifierToast(
    'Test Title 2',
    NotifierTypes.Toast,
    NotifierSeverity.Info,
    'Test Message 2'
  ),
  Utils.createNotifierToast(
    'Test Title 3',
    NotifierTypes.Toast,
    NotifierSeverity.Success,
    'Test Message 3'
  ),
];

export const selectorState = {
  toasts,
  dialogs,
};

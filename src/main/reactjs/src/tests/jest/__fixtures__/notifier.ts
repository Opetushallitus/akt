import { Utils } from 'utils';
import {
  NotifierButtonVariant,
  NotifierSeverity,
  NotifierTypes,
} from 'enums/app';
import { NOTIFIER_ACTION_DO_NOTHING } from 'redux/actionTypes/notifier';

export const toastsArray = [
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

export const dialogsArray = [
  Utils.createNotifierDialog(
    'Test Title 1',
    NotifierTypes.Dialog,
    NotifierSeverity.Info,
    'Test Description 1',
    [
      {
        title: 'Test Action 1',
        variant: NotifierButtonVariant.Outlined,
        action: NOTIFIER_ACTION_DO_NOTHING,
      },
    ]
  ),
];

export const emptyNotifierState = { dialogs: [], toasts: [] };

export const notifierState = {
  toasts: toastsArray,
  dialogs: dialogsArray,
};

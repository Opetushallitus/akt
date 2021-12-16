import { Action } from 'redux';

import { UiStates } from 'enums/app';

export const DISPLAY_UI_STATE = 'UI_STATE/DISPLAY';

export type DisplayUiStateActionType = {
  type: typeof DISPLAY_UI_STATE;
  state: UiStates;
};

export function isDisplayUiStateAction(
  action: Action
): action is DisplayUiStateActionType {
  return action.type == DISPLAY_UI_STATE;
}

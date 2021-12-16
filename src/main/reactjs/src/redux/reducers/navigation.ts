import { Action, Reducer } from 'redux';

import { UiStates } from 'enums/app';
import { UiState } from 'interfaces/uiState';
import { isDisplayUiStateAction } from 'redux/actionTypes/navigation';

const defaultState = { state: UiStates.PublicTranslatorListing };

export const uiStateReducer: Reducer<UiState, Action> = (
  state = defaultState,
  action
) => {
  if (isDisplayUiStateAction(action)) {
    return { state: action.state };
  }
  return state;
};

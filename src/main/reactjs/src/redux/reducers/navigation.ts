import { Action, Reducer } from 'redux';

import { PublicUIViews } from 'enums/app';
import { PublicUIState } from 'interfaces/UIState';
import { isSetPublicUIViewActionType } from 'redux/actionTypes/navigation';

const defaultViewState = {
  currentView: PublicUIViews.PublicTranslatorListing,
};

export const UIStateReducer: Reducer<PublicUIState, Action> = (
  state = defaultViewState,
  action
) => {
  if (isSetPublicUIViewActionType(action)) {
    return { currentView: action.view };
  }

  return state;
};

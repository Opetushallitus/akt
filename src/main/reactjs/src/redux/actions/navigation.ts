import { UiStates } from 'enums/app';
import { DISPLAY_UI_STATE } from 'redux/actionTypes/navigation';

export const displayUiState = (state: UiStates) => ({
  type: DISPLAY_UI_STATE,
  state,
});

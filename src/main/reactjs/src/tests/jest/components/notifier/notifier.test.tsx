import renderer from 'react-test-renderer';
import { render } from '@testing-library/react';

import { DialogBox } from 'components/notification/DialogBox';
import { Toast } from 'components/notification/Toast';
import {
  selectorState,
  toastsArray,
  dialogsArray,
} from 'tests/jest/__fixtures__/notifier';
import { NotifierState } from 'interfaces/notifier';
import { useAppSelector } from 'configs/redux';
import { notifierReducer } from 'redux/reducers/notifier';
import {
  removeNotifierDialog,
  removeNotifierToast,
  showNotifierDialog,
  showNotifierToast,
} from 'redux/actions/notifier';

beforeEach(() => {
  const appSelector = useAppSelector as jest.Mock<NotifierState>;
  appSelector.mockImplementation(() => selectorState);
});

describe('DialogBox', () => {
  it('should render DialogBox correctly', () => {
    const { baseElement } = render(<DialogBox />);

    expect(baseElement).toMatchSnapshot();
  });

  it('should show a Dialog when an action is dispatched', () => {
    const [dialog] = dialogsArray;
    const previousState = { dialogs: [], toasts: [] };
    const dialogCreator = showNotifierDialog(dialog);

    const newState = notifierReducer(previousState, dialogCreator);

    expect(newState).toEqual({ dialogs: [dialog], toasts: [] });
  });

  it('should remove a Dialog when an action is dispatched', () => {
    const [dialog] = dialogsArray;
    const previousState = { dialogs: [dialog], toasts: [] };
    const dialogCreator = removeNotifierDialog(dialog.id);

    const newState = notifierReducer(previousState, dialogCreator);

    expect(newState).toEqual({ dialogs: [], toasts: [] });
  });
});

describe('Toast', () => {
  it('should render Toast correctly', () => {
    const tree = renderer.create(<Toast />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should show a Toast when an action is dispatched', () => {
    const [toast] = toastsArray;
    const previousState = { dialogs: [], toasts: [] };
    const toastCreator = showNotifierToast(toast);

    const newState = notifierReducer(previousState, toastCreator);

    expect(newState).toEqual({ dialogs: [], toasts: [toast] });
  });

  it('should remove a Toast when an action is dispatched', () => {
    const [toast] = toastsArray;
    const previousState = { dialogs: [], toasts: [toast] };
    const toastCreator = removeNotifierToast(toast.id);

    const newState = notifierReducer(previousState, toastCreator);

    expect(newState).toEqual({ dialogs: [], toasts: [] });
  });
});

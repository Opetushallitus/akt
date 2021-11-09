import { createStore, combineReducers } from 'redux';

export default () => {
  const store = createStore(
    combineReducers({}),
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
      (window as any).__REDUX_DEVTOOLS_EXTENSION__()
  );

  return store;
};

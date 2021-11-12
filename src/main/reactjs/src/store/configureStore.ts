import { createStore, combineReducers } from 'redux';

export default () => {
  const store = createStore(
    combineReducers({})
    //  FIXME Use only in dev env and add type guards
    // (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    //   (window as any).__REDUX_DEVTOOLS_EXTENSION__()
  );

  return store;
};

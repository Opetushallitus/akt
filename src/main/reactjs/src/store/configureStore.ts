import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import createSagaMiddleware from '@redux-saga/core';

import { translatorDetailsReducer } from 'reducers/translators/translatorDetails';
import rootSaga from 'sagas';

/* eslint-disable @typescript-eslint/no-explicit-any */
export default () => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewareEnhancer = applyMiddleware(sagaMiddleware);
  //  FIXME Use only in dev env and add type guards
  const devToolsEnhancer =
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__();

  const composedEnhancers = compose(middlewareEnhancer, devToolsEnhancer);

  const store = createStore(
    combineReducers({
      translatorDetails: translatorDetailsReducer,
    }),
    undefined,
    composedEnhancers
  );

  sagaMiddleware.run(rootSaga);
  return store;
};
/* eslint-enable */

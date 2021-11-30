import { composeWithDevTools } from 'redux-devtools-extension';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import createSagaMiddleware from '@redux-saga/core';

import { translatorDetailsReducer } from 'reducers/translators/translatorDetails';
import rootSaga from 'sagas';

export default () => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewareEnhancer = applyMiddleware(sagaMiddleware);

  const store = createStore(
    combineReducers({
      translatorDetails: translatorDetailsReducer,
    }),
    composeWithDevTools(middlewareEnhancer)
  );

  sagaMiddleware.run(rootSaga);
  return store;
};

import { composeWithDevTools } from 'redux-devtools-extension';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import createSagaMiddleware from '@redux-saga/core';

import { translatorDetailsReducer } from 'redux/reducers/translatorDetails';
import rootSaga from 'redux/sagas/index';

const sagaMiddleware = createSagaMiddleware();
const middlewareEnhancer = applyMiddleware(sagaMiddleware);

export default () => {
  const store = createStore(
    combineReducers({
      translatorDetails: translatorDetailsReducer,
    }),
    composeWithDevTools(middlewareEnhancer)
  );

  sagaMiddleware.run(rootSaga);
  return store;
};

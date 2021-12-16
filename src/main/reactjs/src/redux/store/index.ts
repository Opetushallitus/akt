import { composeWithDevTools } from 'redux-devtools-extension';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import createSagaMiddleware from '@redux-saga/core';

import { translatorDetailsReducer } from 'redux/reducers/translatorDetails';
import rootSaga from 'redux/sagas/index';
import { contactRequestReducer } from 'redux/reducers/contactRequest';
import { uiStateReducer } from 'redux/reducers/navigation';

const sagaMiddleware = createSagaMiddleware();
const middlewareEnhancer = applyMiddleware(sagaMiddleware);

export default () => {
  const composeEnhancers = composeWithDevTools({ serialize: true });
  const store = createStore(
    combineReducers({
      translatorDetails: translatorDetailsReducer,
      contactRequest: contactRequestReducer,
      uiState: uiStateReducer,
    }),
    composeEnhancers(middlewareEnhancer)
  );

  sagaMiddleware.run(rootSaga);
  return store;
};

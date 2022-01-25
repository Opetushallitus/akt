import { composeWithDevTools } from 'redux-devtools-extension';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import createSagaMiddleware from '@redux-saga/core';

import rootSaga from 'redux/sagas/index';
import { clerkTranslatorReducer } from 'redux/reducers/clerkTranslator';
import { publicTranslatorReducer } from 'redux/reducers/publicTranslator';
import { contactRequestReducer } from 'redux/reducers/contactRequest';
import { publicUIViewReducer } from 'redux/reducers/publicUIView';
import { notifierReducer } from 'redux/reducers/notifier';
import { clerkTranslatorEmailReducer } from 'redux/reducers/clerkTranslatorEmail';
import { clerkUserReducer } from 'redux/reducers/clerkUser';

const sagaMiddleware = createSagaMiddleware();
const middlewareEnhancer = applyMiddleware(sagaMiddleware);

export default () => {
  const composeEnhancers = composeWithDevTools({ serialize: true });
  const store = createStore(
    combineReducers({
      publicTranslator: publicTranslatorReducer,
      clerkTranslator: clerkTranslatorReducer,
      clerkTranslatorEmail: clerkTranslatorEmailReducer,
      contactRequest: contactRequestReducer,
      publicUIView: publicUIViewReducer,
      clerkUser: clerkUserReducer,
      notifier: notifierReducer,
    }),
    composeEnhancers(middlewareEnhancer)
  );

  sagaMiddleware.run(rootSaga);

  return store;
};

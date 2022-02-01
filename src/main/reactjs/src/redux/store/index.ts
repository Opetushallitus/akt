import createSagaMiddleware from '@redux-saga/core';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import { clerkTranslatorReducer } from 'redux/reducers/clerkTranslator';
import { clerkTranslatorEmailReducer } from 'redux/reducers/clerkTranslatorEmail';
import { clerkUserReducer } from 'redux/reducers/clerkUser';
import { contactRequestReducer } from 'redux/reducers/contactRequest';
import { notifierReducer } from 'redux/reducers/notifier';
import { publicTranslatorReducer } from 'redux/reducers/publicTranslator';
import { publicUIViewReducer } from 'redux/reducers/publicUIView';
import rootSaga from 'redux/sagas/index';

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

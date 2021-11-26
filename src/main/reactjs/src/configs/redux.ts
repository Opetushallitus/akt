import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import configureStore from 'store/configureStore';

export const store = configureStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

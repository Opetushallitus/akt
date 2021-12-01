import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import configureStore from 'redux/store/configureStore';

export const store = configureStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

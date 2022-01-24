import { RootState } from 'configs/redux';

export const clerkMeSelector = (state: RootState) => state.clerkMe;

export const selectClerkMeAuthStatus = (state: RootState) =>
  state.clerkMe.isAuthenticated;

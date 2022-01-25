import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from 'configs/redux';
import { loadClerkUser, loadClerkMockUser } from 'redux/actions/clerkUser';
import { clerkUserSelector } from 'redux/selectors/clerkUser';
import { APIResponseStatus } from 'enums/api';
import { AppRoutes } from 'enums/app';

export const useAuthentication = () => {
  // Redux
  const dispatch = useAppDispatch();
  const clerkUser = useAppSelector(clerkUserSelector);

  useEffect(() => {
    const activeURL = window.location.href;
    const clerkURL = AppRoutes.ClerkHomePage;

    if (clerkUser.status === APIResponseStatus.NotStarted) {
      if (REACT_ENV_PRODUCTION && activeURL.includes(clerkURL)) {
        dispatch(loadClerkUser);
      } else if (activeURL.includes(clerkURL)) {
        dispatch(loadClerkMockUser);
      }
    }
  }, [clerkUser.status, dispatch]);

  return [clerkUser.isAuthenticated, clerkUser];
};

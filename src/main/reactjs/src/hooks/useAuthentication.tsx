import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from 'configs/redux';
import { loadClerkMe, loadClerkMeMock } from 'redux/actions/clerkMe';
import { clerkMeSelector } from 'redux/selectors/clerkMe';
import { APIResponseStatus } from 'enums/api';

export const useAuthentication = () => {
  // Redux
  const dispatch = useAppDispatch();
  const clerkMe = useAppSelector(clerkMeSelector);

  useEffect(() => {
    const activeURL = window.location.href;
    const clerkURL = 'https://virkailija.';
    const clerkDevURL = 'localhost:4000/akt/virkailija';

    if (clerkMe.status === APIResponseStatus.NotStarted) {
      if (REACT_ENV_PRODUCTION && activeURL.includes(clerkURL)) {
        dispatch(loadClerkMe);
      } else if (activeURL.includes(clerkDevURL)) {
        dispatch(loadClerkMeMock);
      }
    }
  }, [clerkMe.status, dispatch]);

  return [clerkMe.isAuthenticated, clerkMe];
};

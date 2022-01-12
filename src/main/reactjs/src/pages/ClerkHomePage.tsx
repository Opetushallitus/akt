import { FC, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from 'configs/redux';
import { ClerkTranslatorsRegistry } from 'components/clerkTranslator/ClerkTranslatorRegistry';
import { UIStates } from 'enums/app';
import { ClerkSendEmailPage } from 'pages/ClerkSendEmailPage';
import { loadClerkTranslators } from 'redux/actions/clerkTranslator';
import { UIStateSelector } from 'redux/selectors/navigation';

export const ClerkHomePage: FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(loadClerkTranslators);
  }, [dispatch]);
  const uiState = useAppSelector(UIStateSelector).state;

  return (
    <>
      {uiState == UIStates.ClerkTranslatorRegistry && (
        <ClerkTranslatorsRegistry />
      )}
      {uiState == UIStates.ClerkSendEmailPage && <ClerkSendEmailPage />}
    </>
  );
};

import { FC, useEffect } from 'react';

import { useAppDispatch } from 'configs/redux';
import { ClerkTranslatorsRegistry } from 'components/clerkTranslator/ClerkTranslatorRegistry';
import { loadClerkTranslators } from 'redux/actions/clerkTranslator';

export const ClerkHomePage: FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(loadClerkTranslators);
  }, [dispatch]);

  return <ClerkTranslatorsRegistry />;
};

import { Blocker, Transition } from 'history';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { useBlocker } from 'hooks/navigation/useBlocker';

export function useCallbackPrompt(when: boolean) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPrompt, setShowPrompt] = useState(false);
  const [blockedTransition, setBlockedTransition] = useState<
    Transition | undefined
  >(undefined);
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);

  const cancelNavigation = useCallback(() => {
    setShowPrompt(false);
  }, []);

  const handleBlockedNavigation: Blocker = useCallback(
    (nextLocation) => {
      // If navigating to a new location, block the transition
      // until confirmed by user. Set showPrompt (returned from hook)
      // to true, so that a confirmation dialog can be shown.
      if (
        !confirmedNavigation &&
        nextLocation.location.pathname !== location.pathname
      ) {
        setShowPrompt(true);
        setBlockedTransition(nextLocation);

        return false;
      }

      // If confirmation is given, let transition proceed regularly.
      return true;
    },
    [confirmedNavigation, location.pathname]
  );

  const confirmNavigation = useCallback(() => {
    setShowPrompt(false);
    setConfirmedNavigation(true);
  }, []);

  useEffect(() => {
    if (confirmedNavigation && blockedTransition) {
      navigate(blockedTransition.location.pathname);
    }
  }, [confirmedNavigation, blockedTransition, navigate]);

  useBlocker(handleBlockedNavigation, when);

  return { showPrompt, confirmNavigation, cancelNavigation };
}

import { Blocker, History, Transition } from 'history';
import { useContext, useEffect } from 'react';
import { UNSAFE_NavigationContext } from 'react-router';

export const useBlocker = (blocker: Blocker, when: boolean) => {
  const navigator = useContext(UNSAFE_NavigationContext).navigator as History;

  useEffect(() => {
    if (when) {
      const unblock = navigator.block((tx: Transition) => {
        const autoUnblockingTx = {
          ...tx,
          retry() {
            unblock();
            tx.retry();
          },
        };
        blocker(autoUnblockingTx);
      });

      return unblock;
    }
  }, [navigator, blocker, when]);
};

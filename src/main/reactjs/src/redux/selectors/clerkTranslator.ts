import { createSelector } from 'reselect';

import { RootState } from 'configs/redux';
import { ClerkTranslator } from 'interfaces/clerkTranslator';
import { Authorisation } from 'interfaces/authorisation';
import { AuthorisationStatus } from 'enums/clerkTranslator';

export const clerkTranslatorsSelector = (state: RootState) =>
  state.clerkTranslator;

export const selectTranslatorsByAuthorisationStatus = createSelector(
  (state: RootState) => state.clerkTranslator.translators,
  (translators) => {
    // TODO Note that this has an *implicit* dependency on the current system time,
    // which we currently fail to take into account properly - the selectors should
    // somehow make the dependency on time explicit!
    const authorised = translators.filter((t) =>
      filterByAuthorisationStatus(t, AuthorisationStatus.Authorised)
    );
    const expiring = translators.filter((t) =>
      filterByAuthorisationStatus(t, AuthorisationStatus.Expiring)
    );
    const expired = translators.filter((t) =>
      filterByAuthorisationStatus(t, AuthorisationStatus.Expired)
    );

    return {
      authorised,
      expiring,
      expired,
    };
  }
);

// Helpers

const isAuthorisationValid = ({ term }: Authorisation, now: Date) => {
  if (!term) {
    return true;
  }
  if (!term.end) {
    return true;
  }

  return now < term.end;
};

const isAuthorisationExpiringSoon = (
  { term }: Authorisation,
  expiringSoonThreshold: Date
) => {
  if (!term) {
    return false;
  }
  if (!term.end) {
    return false;
  }

  return term.end < expiringSoonThreshold;
};

const filterByAuthorisationStatus = (
  translator: ClerkTranslator,
  status: AuthorisationStatus
) => {
  const now = new Date();
  switch (status) {
    case AuthorisationStatus.Authorised:
      return translator.authorisations.find((a) =>
        isAuthorisationValid(a, now)
      );
    case AuthorisationStatus.Expiring:
      const expiringSoonThreshold = new Date();
      expiringSoonThreshold.setMonth(expiringSoonThreshold.getMonth() + 2);

      return translator.authorisations.find(
        (a) =>
          isAuthorisationValid(a, now) &&
          isAuthorisationExpiringSoon(a, expiringSoonThreshold)
      );
    case AuthorisationStatus.Expired:
      return translator.authorisations.find(
        (a) => !isAuthorisationValid(a, now)
      );
  }
};

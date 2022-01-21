import { createSelector } from 'reselect';

import { RootState } from 'configs/redux';
import { ClerkTranslator } from 'interfaces/clerkTranslator';
import { Authorisation, AuthorisationBasis } from 'interfaces/authorisation';
import { AuthorisationStatus } from 'enums/clerkTranslator';
import { DateUtils } from 'utils/date';

export const clerkTranslatorsSelector = (state: RootState) =>
  state.clerkTranslator;

export const selectTranslatorsByAuthorisationStatus = createSelector(
  (state: RootState) => state.clerkTranslator.translators,
  (translators) => {
    // TODO Note that this has an *implicit* dependency on the current system time,
    // which we currently fail to take into account properly - the selectors should
    // somehow make the dependency on time explicit!
    const currentDate = DateUtils.dateAtStartOfDay(new Date());
    const authorised = translators.filter((t) =>
      filterByAuthorisationStatus(
        t,
        AuthorisationStatus.Authorised,
        currentDate
      )
    );
    const expiring = translators.filter((t) =>
      filterByAuthorisationStatus(t, AuthorisationStatus.Expiring, currentDate)
    );
    const expired = translators.filter((t) =>
      filterByAuthorisationStatus(t, AuthorisationStatus.Expired, currentDate)
    );

    return {
      authorised,
      expiring,
      expired,
    };
  }
);

export const selectFilteredClerkTranslators = createSelector(
  (state: RootState) => state.clerkTranslator.translators,
  (state: RootState) => state.clerkTranslator.filters,
  (translators, filters) => {
    const currentDate = DateUtils.dateAtStartOfDay(new Date());

    let filtered = translators.filter((t) =>
      filterByAuthorisationStatus(t, filters.authorisationStatus, currentDate)
    );

    if (filters.name) {
      const nameFilter = filters.name;
      filtered = filtered.filter((t) => filterByName(t, nameFilter));
    }

    if (filters.town) {
      const town = filters.town;
      filtered = filtered.filter((t) => filterByTown(t, town));
    }

    if (filters.fromLang) {
      const fromLang = filters.fromLang;
      filtered = filtered.filter((t) => filterByFromLang(t, fromLang));
    }

    if (filters.toLang) {
      const toLang = filters.toLang;
      filtered = filtered.filter((t) => filterByToLang(t, toLang));
    }

    if (filters.authorisationBasis) {
      const authorisationBasis =
        filters.authorisationBasis as AuthorisationBasis;
      filtered = filtered.filter((t) =>
        filterByAuthorisationBasis(t, authorisationBasis)
      );
    }

    return filtered;
  }
);

export const selectFilteredSelectedIds = createSelector(
  selectFilteredClerkTranslators,
  (state: RootState) => state.clerkTranslator.selectedTranslators,
  (filteredTranslators, selectedTranslators) => {
    const filteredIds = new Set(filteredTranslators.map((t) => t.id));

    return selectedTranslators.filter((id) => filteredIds.has(id));
  }
);

export const selectFilteredSelectedTranslators = createSelector(
  selectFilteredClerkTranslators,
  selectFilteredSelectedIds,
  (filtered, selectedIds) => {
    const ids = new Set(selectedIds);

    return filtered.filter(({ id }) => ids.has(id));
  }
);

// Helpers

const isAuthorisationValid = (
  authorisation: Authorisation,
  currentDate: Date
) => {
  const term = authorisation.effectiveTerm;
  if (!term || !term.end) {
    return true;
  }

  return currentDate <= term.end;
};

const isAuthorisationExpiringSoon = (
  authorisation: Authorisation,
  expiringSoonThreshold: Date
) => {
  const term = authorisation.effectiveTerm;
  if (!term || !term.end) {
    return false;
  }

  return term.end < expiringSoonThreshold;
};

const filterByAuthorisationStatus = (
  translator: ClerkTranslator,
  status: AuthorisationStatus,
  currentDate: Date
) => {
  switch (status) {
    case AuthorisationStatus.Authorised:
      return translator.authorisations.find((a) =>
        isAuthorisationValid(a, currentDate)
      );
    case AuthorisationStatus.Expiring:
      const expiringSoonThreshold = new Date();
      expiringSoonThreshold.setMonth(expiringSoonThreshold.getMonth() + 2);

      return translator.authorisations.find(
        (a) =>
          isAuthorisationValid(a, currentDate) &&
          isAuthorisationExpiringSoon(a, expiringSoonThreshold)
      );
    case AuthorisationStatus.Expired:
      return translator.authorisations.find(
        (a) => !isAuthorisationValid(a, currentDate)
      );
  }
};

const filterByName = (translator: ClerkTranslator, name: string) => {
  const { firstName, lastName } = translator.contactDetails;
  const nameCombs = [`${firstName} ${lastName}`, `${lastName} ${firstName}`];

  return nameCombs.some((comb) => comb.toLowerCase().includes(name));
};

const filterByTown = (translator: ClerkTranslator, town: string) => {
  return translator.contactDetails.town?.toLowerCase().includes(town);
};

const filterByFromLang = (translator: ClerkTranslator, fromLang: string) => {
  return translator.authorisations.find(
    ({ languagePair }) => fromLang == languagePair.from
  );
};

const filterByToLang = (translator: ClerkTranslator, toLang: string) => {
  return translator.authorisations.find(
    ({ languagePair }) => toLang == languagePair.to
  );
};

const filterByAuthorisationBasis = (
  translator: ClerkTranslator,
  authorisationBasis: AuthorisationBasis
) => {
  return translator.authorisations.find(
    ({ basis }) => basis == authorisationBasis
  );
};

import { createSelector } from 'reselect';

import { RootState } from 'configs/redux';
import {
  ClerkTranslator,
  ClerkTranslatorFilter,
} from 'interfaces/clerkTranslator';
import { Authorisation } from 'interfaces/authorisation';
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

    let filtered = translators;

    if (filters.name) {
      const nameFilter = filters.name;
      filtered = filtered.filter((t) => filterByName(t, nameFilter));
    }

    if (filters.town) {
      const town = filters.town;
      filtered = filtered.filter((t) => filterByTown(t, town));
    }

    filtered = filtered.filter((t) =>
      filterByAuthorisationCriteria(t, filters, currentDate)
    );

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

const expiringSoonTreshold = (currentDate: Date) => {
  const expiringSoonThreshold = DateUtils.dateAtStartOfDay(currentDate);
  expiringSoonThreshold.setMonth(expiringSoonThreshold.getMonth() + 3);

  return expiringSoonThreshold;
};

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
  const expiringSoonDate = expiringSoonTreshold(currentDate);

  return translator.authorisations.find((a) =>
    matchesAuthorisationStatus(
      { authorisationStatus: status },
      currentDate,
      expiringSoonDate,
      a
    )
  );
};

const filterByAuthorisationCriteria = (
  translator: ClerkTranslator,
  filters: ClerkTranslatorFilter,
  currentDate: Date
) => {
  const expiringSoonDate = expiringSoonTreshold(currentDate);

  return translator.authorisations.find(
    (a) =>
      matchesFromLang(filters, a) &&
      matchesToLang(filters, a) &&
      matchesAuthorisationBasis(filters, a) &&
      matchesAuthorisationStatus(filters, currentDate, expiringSoonDate, a)
  );
};

const matchesFromLang = (
  { fromLang }: ClerkTranslatorFilter,
  authorisation: Authorisation
) => {
  if (fromLang) {
    return authorisation.languagePair.from == fromLang;
  }

  return true;
};

const matchesToLang = (
  { toLang }: ClerkTranslatorFilter,
  authorisation: Authorisation
) => {
  if (toLang) {
    return authorisation.languagePair.to == toLang;
  }

  return true;
};

const matchesAuthorisationBasis = (
  { authorisationBasis }: ClerkTranslatorFilter,
  authorisation: Authorisation
) => {
  if (authorisationBasis) {
    return authorisation.basis == authorisationBasis;
  }

  return true;
};

const matchesAuthorisationStatus = (
  { authorisationStatus }: ClerkTranslatorFilter,
  currentDate: Date,
  expiringSoonThreshold: Date,
  authorisation: Authorisation
) => {
  switch (authorisationStatus) {
    case AuthorisationStatus.Authorised:
      return isAuthorisationValid(authorisation, currentDate);
    case AuthorisationStatus.Expiring:
      return (
        isAuthorisationValid(authorisation, currentDate) &&
        isAuthorisationExpiringSoon(authorisation, expiringSoonThreshold)
      );
    case AuthorisationStatus.Expired:
      return !isAuthorisationValid(authorisation, currentDate);
  }
};

const trimAndLowerCase = (val: string) => val.trim().toLowerCase();

const filterByName = (translator: ClerkTranslator, name: string) => {
  const { firstName, lastName } = translator.contactDetails;
  const nameCombs = [
    `${firstName} ${lastName}`,
    `${lastName} ${firstName}`,
  ].map(trimAndLowerCase);

  return nameCombs.some((comb) => comb.includes(trimAndLowerCase(name)));
};

const filterByTown = (translator: ClerkTranslator, town: string) => {
  return translator.contactDetails.town
    ?.trim()
    .toLowerCase()
    .includes(trimAndLowerCase(town));
};

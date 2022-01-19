import { APIEndpoints } from 'enums/api';
import { AuthorisationStatus } from 'enums/clerkTranslator';
import { runWithIntercept } from 'tests/cypress/support/utils/api';
import { useFixedDate } from 'tests/cypress/support/utils/date';
import { onClerkHomePage } from 'tests/cypress/support/page-objects/clerkHomePage';

const fixedDateForTests = new Date('2022-01-17T12:35:00+0200');

beforeEach(() => {
  useFixedDate(fixedDateForTests);
  runWithIntercept(
    APIEndpoints.ClerkTranslator,
    { fixture: 'clerk_translators_100.json' },
    () => cy.openClerkHomePage()
  );
});

const translatorCountsByAuthorisationStatus = {
  [AuthorisationStatus.Authorised]: 98,
  [AuthorisationStatus.Expiring]: 59,
  [AuthorisationStatus.Expired]: 2,
};

describe('ClerkHomePage', () => {
  it('should display correct number of translators in its header', () => {
    onClerkHomePage.expectTotalTranslatorsCount(100);
  });

  it('should filter translators based on selected authorisation status', () => {
    // Use fixed date in tests as the as the authorisation status filters depend on it.
    onClerkHomePage.expectSelectedTranslatorsCount(
      translatorCountsByAuthorisationStatus[AuthorisationStatus.Authorised]
    );

    onClerkHomePage.filterByAuthorisationStatus(AuthorisationStatus.Expiring);
    onClerkHomePage.expectSelectedTranslatorsCount(
      translatorCountsByAuthorisationStatus[AuthorisationStatus.Expiring]
    );

    onClerkHomePage.filterByAuthorisationStatus(AuthorisationStatus.Expired);
    onClerkHomePage.expectSelectedTranslatorsCount(
      translatorCountsByAuthorisationStatus[AuthorisationStatus.Expired]
    );

    onClerkHomePage.filterByAuthorisationStatus(AuthorisationStatus.Authorised);
    onClerkHomePage.expectSelectedTranslatorsCount(
      translatorCountsByAuthorisationStatus[AuthorisationStatus.Authorised]
    );
  });
});

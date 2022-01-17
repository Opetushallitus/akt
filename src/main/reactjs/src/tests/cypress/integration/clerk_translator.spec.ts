import { APIEndpoints } from 'enums/api';
import { AuthorisationStatus } from 'enums/clerkTranslator';
import { runWithIntercept } from 'tests/cypress/support/utils/api';
import { useFixedDate } from 'tests/cypress/support/utils/date';
import { onClerkTranslatorRegistry } from 'tests/cypress/support/page-objects/clerkTranslatorRegistry';

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
  [AuthorisationStatus.Authorised]: 97,
  [AuthorisationStatus.Expiring]: 58,
  [AuthorisationStatus.Expired]: 3,
};

describe('ClerkTranslatorRegistry', () => {
  it('should display correct number of translators in its header', () => {
    onClerkTranslatorRegistry.expectTotalTranslatorsCount(100);
  });

  it('should filter translators based on selected authorisation status', () => {
    // Use fixed date in tests as the as the authorisation status filters depend on it.
    onClerkTranslatorRegistry.expectSelectedTranslatorsCount(
      translatorCountsByAuthorisationStatus[AuthorisationStatus.Authorised]
    );

    onClerkTranslatorRegistry.filterByAuthorisationStatus(
      AuthorisationStatus.Expiring
    );
    onClerkTranslatorRegistry.expectSelectedTranslatorsCount(
      translatorCountsByAuthorisationStatus[AuthorisationStatus.Expiring]
    );

    onClerkTranslatorRegistry.filterByAuthorisationStatus(
      AuthorisationStatus.Expired
    );
    onClerkTranslatorRegistry.expectSelectedTranslatorsCount(
      translatorCountsByAuthorisationStatus[AuthorisationStatus.Expired]
    );

    onClerkTranslatorRegistry.filterByAuthorisationStatus(
      AuthorisationStatus.Authorised
    );
    onClerkTranslatorRegistry.expectSelectedTranslatorsCount(
      translatorCountsByAuthorisationStatus[AuthorisationStatus.Authorised]
    );
  });
});

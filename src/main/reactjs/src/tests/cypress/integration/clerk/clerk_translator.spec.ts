import { APIEndpoints } from 'enums/api';
import { AuthorisationStatus } from 'enums/clerkTranslator';
import { onClerkHomePage } from 'tests/cypress/support/page-objects/clerkHomePage';
import { runWithIntercept } from 'tests/cypress/support/utils/api';
import { useFixedDate } from 'tests/cypress/support/utils/date';

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
  [AuthorisationStatus.Expiring]: 88,
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

  it('should allow combining multiple filters to narrow down on translators', () => {
    onClerkHomePage.filterByAuthorisationStatus(AuthorisationStatus.Authorised);
    onClerkHomePage.filterByAuthorisationBasis('VIR');
    onClerkHomePage.expectSelectedTranslatorsCount(15);

    // Authorisation with basis VIR should never expire => expect 0 matching translators.
    onClerkHomePage.filterByAuthorisationStatus(AuthorisationStatus.Expiring);
    onClerkHomePage.expectSelectedTranslatorsCount(0);

    onClerkHomePage.filterByAuthorisationStatus(AuthorisationStatus.Authorised);
    onClerkHomePage.filterByAuthorisationBasis('AUT');
    onClerkHomePage.filterByPermissonToPublishBasis('Ei');
    onClerkHomePage.expectSelectedTranslatorsCount(8);

    onClerkHomePage.filterByAuthorisationStatus(AuthorisationStatus.Expiring);
    onClerkHomePage.filterByAuthorisationBasis('KKT');
    onClerkHomePage.clearFilterByPermissonToPublishBasis();
    onClerkHomePage.expectSelectedTranslatorsCount(13);

    onClerkHomePage.filterByFromLang('ruotsi');
    onClerkHomePage.expectSelectedTranslatorsCount(3);

    onClerkHomePage.filterByToLang('iiri');
    onClerkHomePage.expectSelectedTranslatorsCount(1);

    // First apply filter that doesn't match any name and expect zero results
    onClerkHomePage.filterByName('Kari Kink');
    onClerkHomePage.expectSelectedTranslatorsCount(0);

    // Fix typo made above, check that results are as expected
    onClerkHomePage.filterByName('Kari Kin');
    onClerkHomePage.expectSelectedTranslatorsCount(1);
  });
});

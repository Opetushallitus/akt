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
  [AuthorisationStatus.FormerVIR]: 8,
};

describe('ClerkHomePage', () => {
  it('should display correct number of translators in its header', () => {
    onClerkHomePage.expectTotalTranslatorsCount(100);
  });

  it('should filter translators by authorisation status', () => {
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

    onClerkHomePage.filterByAuthorisationStatus(AuthorisationStatus.FormerVIR);
    onClerkHomePage.expectSelectedTranslatorsCount(
      translatorCountsByAuthorisationStatus[AuthorisationStatus.FormerVIR]
    );

    onClerkHomePage.filterByAuthorisationStatus(AuthorisationStatus.Authorised);
    onClerkHomePage.expectSelectedTranslatorsCount(
      translatorCountsByAuthorisationStatus[AuthorisationStatus.Authorised]
    );
  });

  it('should filter translators by from lang', () => {
    onClerkHomePage.filterByFromLang('katalaani');
    onClerkHomePage.expectSelectedTranslatorsCount(5); // 5 authorised, 1 expired
  });

  it('should filter translators by to lang', () => {
    onClerkHomePage.filterByToLang('iiri');
    onClerkHomePage.expectSelectedTranslatorsCount(6); // 6 authorised, 1 former VIR
  });

  it('should filter translators by name', () => {
    onClerkHomePage.filterByName('Kari');
    onClerkHomePage.expectSelectedTranslatorsCount(3);
  });

  it('should filter translators by authorisation basis', () => {
    onClerkHomePage.filterByAuthorisationBasis('VIR');
    onClerkHomePage.expectSelectedTranslatorsCount(7);

    // Authorisation with basis VIR should never expire => expect 0 matching translators.
    onClerkHomePage.filterByAuthorisationStatus(AuthorisationStatus.Expiring);
    onClerkHomePage.expectSelectedTranslatorsCount(0);
  });

  it('should filter translators by permission to publish', () => {
    onClerkHomePage.filterByPermissionToPublishBasis(false);
    onClerkHomePage.expectSelectedTranslatorsCount(8);
  });

  it('should combine multiple filters', () => {
    onClerkHomePage.filterByAuthorisationStatus(AuthorisationStatus.Expiring);
    onClerkHomePage.filterByAuthorisationBasis('KKT');
    onClerkHomePage.expectSelectedTranslatorsCount(13);

    onClerkHomePage.filterByFromLang('ruotsi');
    onClerkHomePage.expectSelectedTranslatorsCount(3);

    onClerkHomePage.filterByToLang('iiri');
    onClerkHomePage.expectSelectedTranslatorsCount(1);

    onClerkHomePage.filterByPermissionToPublishBasis(false);
    onClerkHomePage.expectSelectedTranslatorsCount(0);
  });
});

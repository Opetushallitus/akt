import { APIEndpoints } from 'enums/api';
import { translatorResponse } from 'tests/cypress/fixtures/ts/clerkTranslatorOverview';
import { onClerkTranslatorOverviewPage } from 'tests/cypress/support/page-objects/clerkTranslatorOverviewPage';
import { useFixedDate } from 'tests/cypress/support/utils/date';
import { DateUtils } from 'utils/date';

const dayjs = DateUtils.dayjs();
const fixedDateForTests = dayjs('2022-01-17T12:35:00+0200');

beforeEach(() => {
  useFixedDate(fixedDateForTests);

  cy.intercept(
    `${APIEndpoints.ClerkTranslator}/${translatorResponse.id}`,
    translatorResponse
  ).as('getClerkTranslatorOverview');
});

describe('ClerkTranslatorOverview:AuthorisationListing', () => {
  it('should allow changing publish permission for an authorisation', () => {
    onClerkTranslatorOverviewPage.navigateById(translatorResponse.id);
    cy.wait('@getClerkTranslatorOverview');

    onClerkTranslatorOverviewPage.expectAuthorisationRowPublishPermission(
      10000,
      true
    );
  });
});

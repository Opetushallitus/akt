import { APIEndpoints } from 'enums/api';
import { translatorResponse } from 'tests/cypress/fixtures/ts/clerkTranslatorOverview';
import {
  changePublishPermission,
  onAuthorisationDetails,
} from 'tests/cypress/support/page-objects/authorisationListing';
import { onClerkTranslatorOverviewPage } from 'tests/cypress/support/page-objects/clerkTranslatorOverviewPage';
import { onDialog } from 'tests/cypress/support/page-objects/dialog';
import { useFixedDate } from 'tests/cypress/support/utils/date';
import { DateUtils } from 'utils/date';

const dayjs = DateUtils.dayjs();
const fixedDateForTests = dayjs('2022-01-17T12:35:00+0200');
const authorisationId = 10001;

beforeEach(() => {
  useFixedDate(fixedDateForTests);

  cy.intercept(
    `${APIEndpoints.ClerkTranslator}/${translatorResponse.id}`,
    translatorResponse
  ).as('getClerkTranslatorOverview');
});

describe('ClerkTranslatorOverview:AuthorisationDetails', () => {
  it('should open a confirmation dialog when publish permission switch is clicked, and do no changes if user backs out', () => {
    onClerkTranslatorOverviewPage.navigateById(translatorResponse.id);
    cy.wait('@getClerkTranslatorOverview');

    onAuthorisationDetails.switchPermissionPublishById(authorisationId);
    onDialog.expectText('Haluatko varmasti vaihtaa julkaisulupaa?');
    onDialog.clickButtonByText('Takaisin');

    onAuthorisationDetails.expectPermissionPublish(authorisationId, true);
  });

  it.only('should open a confirmation dialog when publish permission switch is clicked, and change the publish permission if user confirms', () => {
    onClerkTranslatorOverviewPage.navigateById(translatorResponse.id);
    cy.wait('@getClerkTranslatorOverview');

    onAuthorisationDetails.expectPermissionPublish(authorisationId, true);
    onAuthorisationDetails.switchPermissionPublishById(authorisationId);

    // Create new response
    const newResponse = changePublishPermission(
      translatorResponse,
      authorisationId,
      false
    );
    cy.intercept(
      'PUT',
      APIEndpoints.AuthorisationPublishPermission,
      newResponse
    ).as('changePublishPermission');
    onDialog.clickButtonByText('Kyllä');
    cy.wait('@changePublishPermission');

    onAuthorisationDetails.expectPermissionPublish(authorisationId, false);
  });

  // it('should open a confirmation dialog when a delete icon is clicked, and do no changes if user backs out', () => {
  //   onClerkTranslatorOverviewPage.navigateById(translatorResponse.id);
  //   cy.wait('@getClerkTranslatorOverview');

  //   onClerkTranslatorOverviewPage.clickAuthorisationRowDeleteButton(10001);

  //   onDialog.expectText('Haluatko varmasti poistaa auktorisoinnin?');
  //   onDialog.clickButtonByText('Takaisin');

  //   // Check that the authorisation still exists
  // });

  // it('should open a confirmation dialog when a delete icon is clicked, and delete authorisation if user confirms', () => {
  //   onClerkTranslatorOverviewPage.navigateById(translatorResponse.id);
  //   cy.wait('@getClerkTranslatorOverview');

  //   onClerkTranslatorOverviewPage.clickAuthorisationRowDeleteButton(10001);

  //   onDialog.expectText('Haluatko varmasti poistaa auktorisoinnin?');
  //   onDialog.clickButtonByText('Poista auktorisointi');

  //   // Check that the authorisation is no longer found
  // });

  // it('should not allow deleting the last authorisation', () => {
  //   onClerkTranslatorOverviewPage.navigateById(translatorResponse.id);
  //   cy.wait('@getClerkTranslatorOverview');

  //   onClerkTranslatorOverviewPage.clickAuthorisationRowDeleteButton(10001);

  //   onDialog.expectText('Haluatko varmasti poistaa auktorisoinnin?');
  //   onDialog.clickButtonByText('Poista auktorisointi');

  //   // Delete the rest of the authorisations under Expired-view and try deleting the last one under VIR to see that deletion not possible
  //   // Ensure toast has some error message
  // });
});

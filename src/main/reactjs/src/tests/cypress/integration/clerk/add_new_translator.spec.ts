import { APIEndpoints } from 'enums/api';
import { newTranslatorResponse } from 'tests/cypress/fixtures/ts/clerkNewTranslator';
import { onClerkNewTranslatorPage } from 'tests/cypress/support/page-objects/clerkNewTranslatorPage';
import { onToast } from 'tests/cypress/support/page-objects/toast';
import { createAPIErrorResponse } from 'tests/cypress/support/utils/api';

beforeEach(() => {
  cy.intercept(APIEndpoints.ClerkTranslator, {
    fixture: 'clerk_translators_10.json',
  });

  cy.intercept('GET', APIEndpoints.MeetingDate, {
    fixture: 'meeting_dates_10.json',
  });

  cy.openClerkHomePage();
});

describe('ClerkAddNewTranslator', () => {
  it('should add new translator with authrotisation successfully', () => {
    cy.intercept(
      'POST',
      APIEndpoints.ClerkTranslator,
      newTranslatorResponse
    ).as('createTranslatorResponse');

    onClerkNewTranslatorPage.clickAddNewTranslatorButton();
    onClerkNewTranslatorPage.fillOutNewTranslatorBasicInformationFields();
    onClerkNewTranslatorPage.fillOutNewTranslatorBasicInformationExtraInformation(
      'Lisätiedot'
    );
    onClerkNewTranslatorPage.clickNewTranslatorAssuranceToggleButton();
    onClerkNewTranslatorPage.clickAddAuthorisationButton();
    onClerkNewTranslatorPage.fillOutAddAuthorisationFields();
    onClerkNewTranslatorPage.addAuthorisation();
    onClerkNewTranslatorPage.expectAuthorisationRowToExist(0);
    onClerkNewTranslatorPage.clickSaveNewClerkButton();
    cy.wait('@createTranslatorResponse');
    onToast.expectText('Kääntäjän tiedot tallennettiin!');
  });

  it('should not add new translator with missing fields', () => {
    cy.intercept(
      'POST',
      APIEndpoints.ClerkTranslator,
      createAPIErrorResponse()
    ).as('createTranslatorResponse');

    onClerkNewTranslatorPage.clickAddNewTranslatorButton();

    onClerkNewTranslatorPage.fillOutNewTranslatorBasicInformationFields([
      {
        fieldName: 'lastName',
        fieldType: 'input',
        value: 'Doeline',
      },
    ]);

    onClerkNewTranslatorPage.clickSaveNewClerkButton();
    cy.wait('@createTranslatorResponse');

    onToast.expectText('Toiminto epäonnistui, yritä myöhemmin uudelleen');
  });
});

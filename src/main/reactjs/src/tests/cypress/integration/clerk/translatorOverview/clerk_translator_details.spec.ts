import { APIEndpoints } from 'enums/api';
import { UIMode } from 'enums/app';
import {
  onClerkTranslatorOverviewPage,
  translatorResponse,
} from 'tests/cypress/support/page-objects/clerkTranslatorOverviewPage';
import { onToast } from 'tests/cypress/support/page-objects/toast';

beforeEach(() => {
  cy.intercept(
    `${APIEndpoints.ClerkTranslator}/${translatorResponse.id}`,
    translatorResponse
  ).as('getClerkTranslatorOverview');

  const updatedExistingTranslator = {
    ...translatorResponse,
    version: 1,
    lastName: 'new last name',
  };
  cy.intercept(
    'PUT',
    APIEndpoints.ClerkTranslator,
    updatedExistingTranslator
  ).as('updateClerkTranslatorOverview');
});

describe('ClerkTranslatorOverview:ClerkTranslatorDetails', () => {
  it('should open view mode when the edit button is clicked', () => {
    onClerkTranslatorOverviewPage.navigateById(translatorResponse.id);
    cy.wait('@getClerkTranslatorOverview');

    onClerkTranslatorOverviewPage.clickEditTranslatorInfoBtn();

    onClerkTranslatorOverviewPage.expectMode(UIMode.EditTranslatorDetails);
  });

  it('should return to view mode when the cancel button is clicked', () => {
    onClerkTranslatorOverviewPage.navigateById(translatorResponse.id);
    cy.wait('@getClerkTranslatorOverview');

    onClerkTranslatorOverviewPage.clickEditTranslatorInfoBtn();
    onClerkTranslatorOverviewPage.clickCancelTranslatorInfoBtn();

    onClerkTranslatorOverviewPage.expectMode(UIMode.View);
  });

  it('should update translator details successfully', () => {
    const fieldName = 'lastName';
    const fieldType = 'input';
    const newLastName = 'new last name';

    onClerkTranslatorOverviewPage.navigateById(translatorResponse.id);
    cy.wait('@getClerkTranslatorOverview');

    onClerkTranslatorOverviewPage.clickEditTranslatorInfoBtn();
    onClerkTranslatorOverviewPage.editTranslatorField(
      fieldName,
      fieldType,
      newLastName
    );
    onClerkTranslatorOverviewPage.clickSaveTranslatorInfoBtn();
    cy.wait('@updateClerkTranslatorOverview');

    onClerkTranslatorOverviewPage.expectMode(UIMode.View);
    onClerkTranslatorOverviewPage.expectTranslatorDetailsFieldValue(
      fieldName,
      fieldType,
      newLastName
    );
    onToast.expectText('Tiedot tallennettiin');
  });
});

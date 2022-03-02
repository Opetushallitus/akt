import { APIEndpoints } from 'enums/api';
import { UIMode } from 'enums/app';
import {
  apiTranslator,
  onClerkTranslatorOverviewPage,
} from 'tests/cypress/support/page-objects/clerkTranslatorOverviewPage';
import { onToast } from 'tests/cypress/support/page-objects/toast';
import { useFixedDate } from 'tests/cypress/support/utils/date';

const fixedDateForTests = new Date('2022-01-17T12:35:00+0200');

beforeEach(() => {
  useFixedDate(fixedDateForTests);

  cy.intercept(
    `${APIEndpoints.ClerkTranslator}/${apiTranslator.id}`,
    apiTranslator
  ).as('getClerkTranslatorOverview');

  const updatedExistingTranslator = {
    ...apiTranslator,
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
    onClerkTranslatorOverviewPage.navigateById(apiTranslator.id);
    cy.wait('@getClerkTranslatorOverview');

    onClerkTranslatorOverviewPage.clickEditTranslatorInfoBtn();

    onClerkTranslatorOverviewPage.expectMode(UIMode.EditTranslatorDetails);
  });

  it('should return to view mode when the cancel button is clicked', () => {
    onClerkTranslatorOverviewPage.navigateById(apiTranslator.id);
    cy.wait('@getClerkTranslatorOverview');

    onClerkTranslatorOverviewPage.clickEditTranslatorInfoBtn();
    onClerkTranslatorOverviewPage.clickCancelTranslatorInfoBtn();

    onClerkTranslatorOverviewPage.expectMode(UIMode.View);
  });

  it('should update translator details successfully', () => {
    const fieldName = 'lastName';
    const fieldType = 'input';
    const newLastName = 'new last name';

    onClerkTranslatorOverviewPage.navigateById(apiTranslator.id);
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

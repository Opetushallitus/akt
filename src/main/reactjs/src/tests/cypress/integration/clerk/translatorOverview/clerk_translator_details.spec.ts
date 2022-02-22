import { APIEndpoints } from 'enums/api';
import { Mode } from 'enums/app';
import {
  existingTranslator,
  onClerkTranslatorOverviewPage,
} from 'tests/cypress/support/page-objects/clerkTranslatorOverviewPage';
import { onToast } from 'tests/cypress/support/page-objects/toast';
import { useFixedDate } from 'tests/cypress/support/utils/date';

const fixedDateForTests = new Date('2022-01-17T12:35:00+0200');
const existingTranslatorId = 2;

beforeEach(() => {
  useFixedDate(fixedDateForTests);

  cy.intercept(
    `${APIEndpoints.ClerkTranslator}/${existingTranslatorId}`,
    existingTranslator
  ).as('getClerkTranslatorOverview');

  const updatedExistingTranslator = {
    ...existingTranslator,
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
    onClerkTranslatorOverviewPage.navigateById(existingTranslator.id);
    cy.wait(['@getClerkTranslatorOverview']);

    onClerkTranslatorOverviewPage.clickEditTranslatorInfoBtn();

    onClerkTranslatorOverviewPage.expectMode(Mode.EditingTranslatorDetails);
  });

  it('should return to view mode when the cancel button is clicked', () => {
    onClerkTranslatorOverviewPage.navigateById(existingTranslator.id);
    cy.wait('@getClerkTranslatorOverview');

    onClerkTranslatorOverviewPage.clickEditTranslatorInfoBtn();
    onClerkTranslatorOverviewPage.clickCancelTranslatorInfoBtn();

    onClerkTranslatorOverviewPage.expectMode(Mode.View);
  });

  it('should update translator details successfully', () => {
    const fieldName = 'lastName';
    const fieldType = 'input';
    const newLastName = 'new last name';

    onClerkTranslatorOverviewPage.navigateById(existingTranslator.id);
    cy.wait('@getClerkTranslatorOverview');

    onClerkTranslatorOverviewPage.clickEditTranslatorInfoBtn();
    onClerkTranslatorOverviewPage.editTranslatorField(
      fieldName,
      fieldType,
      newLastName
    );
    onClerkTranslatorOverviewPage.clickSaveTranslatorInfoBtn();
    cy.wait('@updateClerkTranslatorOverview');

    onClerkTranslatorOverviewPage.expectMode(Mode.View);
    onClerkTranslatorOverviewPage.expectTranslatorDetailsFieldValue(
      fieldName,
      fieldType,
      newLastName
    );
    onToast.expectText('Tiedot tallennettiin');
  });
});

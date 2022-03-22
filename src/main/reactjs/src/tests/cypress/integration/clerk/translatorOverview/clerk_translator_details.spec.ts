import { APIEndpoints } from 'enums/api';
import { UIMode } from 'enums/app';
import {
  authorsationMockAfterAddAuthorsationSuccess,
  translatorResponse,
} from 'tests/cypress/fixtures/ts/clerkTranslatorOverview';
import { onClerkTranslatorOverviewPage } from 'tests/cypress/support/page-objects/clerkTranslatorOverviewPage';
import { onDialog } from 'tests/cypress/support/page-objects/dialog';
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
  it('should open edit mode when the edit button is clicked', () => {
    onClerkTranslatorOverviewPage.navigateById(translatorResponse.id);
    cy.wait('@getClerkTranslatorOverview');

    onClerkTranslatorOverviewPage.clickEditTranslatorInfoBtn();

    onClerkTranslatorOverviewPage.expectMode(UIMode.EditTranslatorDetails);
  });

  it('should open a confirmation dialog when cancel is clicked and stay in edit mode if user backs out', () => {
    onClerkTranslatorOverviewPage.navigateById(translatorResponse.id);
    cy.wait('@getClerkTranslatorOverview');
    onClerkTranslatorOverviewPage.clickEditTranslatorInfoBtn();

    onClerkTranslatorOverviewPage.clickCancelTranslatorInfoBtn();

    onDialog.expectText('Haluatko poistua muokkausnäkymästä?');
    onDialog.clickButtonByText('Takaisin');

    onClerkTranslatorOverviewPage.expectMode(UIMode.EditTranslatorDetails);
  });

  it('should open a confirmation dialog when cancel is clicked and return to view mode if user confirms', () => {
    onClerkTranslatorOverviewPage.navigateById(translatorResponse.id);
    cy.wait('@getClerkTranslatorOverview');
    onClerkTranslatorOverviewPage.clickEditTranslatorInfoBtn();

    onClerkTranslatorOverviewPage.clickCancelTranslatorInfoBtn();

    onDialog.expectText('Haluatko poistua muokkausnäkymästä?');
    onDialog.clickButtonByText('Kyllä');

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

  it('should add authorisation succesfully', () => {
    onClerkTranslatorOverviewPage.navigateById(translatorResponse.id);
    cy.wait('@getClerkTranslatorOverview');

    onClerkTranslatorOverviewPage.clickAddAuthorisationBtn();

    onClerkTranslatorOverviewPage.inputAddAuthorisationField(
      'from',
      'input',
      'suomi'
    );
    onClerkTranslatorOverviewPage.inputAddAuthorisationField(
      'to',
      'input',
      'ruotsi'
    );
    onClerkTranslatorOverviewPage.inputAddAuthorisationField(
      'basis',
      'input',
      'kkt'
    );
    onClerkTranslatorOverviewPage.inputAddAuthorisationField(
      'termBeginDate',
      'input',
      '14.5.2022'
    );
    onClerkTranslatorOverviewPage.inputAddAuthorisationField(
      'diaryNumber',
      'input',
      '1337'
    );

    cy.intercept(`${APIEndpoints.ClerkTranslator}/${translatorResponse.id}`, {
      ...translatorResponse,
      authorisations: [
        ...translatorResponse.authorisations,
        authorsationMockAfterAddAuthorsationSuccess,
      ],
    });

    cy.intercept(
      'POST',
      `${APIEndpoints.ClerkTranslator}/${translatorResponse.id}/authorisation`,
      {
        ...translatorResponse,
        authorisations: [
          ...translatorResponse.authorisations,
          authorsationMockAfterAddAuthorsationSuccess,
        ],
      }
    );

    onClerkTranslatorOverviewPage.saveAuthorisation();

    onToast.expectText('Auktorisointi lisätty onnistuneesti');
    onClerkTranslatorOverviewPage.expectAuthorisationRowToHaveText(
      10004,
      '1337'
    );
  });

  it('should show disabled fields correctly', () => {
    onClerkTranslatorOverviewPage.navigateById(translatorResponse.id);
    cy.wait('@getClerkTranslatorOverview');

    onClerkTranslatorOverviewPage.clickAddAuthorisationBtn();

    onClerkTranslatorOverviewPage.expectDisabledAddAuthorisationField(
      'autDate',
      'input',
      true
    );
    onClerkTranslatorOverviewPage.expectDisabledAddAuthorisationField(
      'termEndDate',
      'input'
    );
    onClerkTranslatorOverviewPage.inputAddAuthorisationField(
      'basis',
      'input',
      'kkt'
    );
    onClerkTranslatorOverviewPage.expectDisabledAddAuthorisationField(
      'autDate',
      'input',
      true
    );
    onClerkTranslatorOverviewPage.inputAddAuthorisationField(
      'basis',
      'input',
      'aut'
    );
    onClerkTranslatorOverviewPage.expectEnabledAddAuthorisationField(
      'autDate',
      'input',
      true
    );
  });

  it('should show error toast when required fields have not been filled', () => {
    cy.intercept(
      'POST',
      `${APIEndpoints.ClerkTranslator}/${translatorResponse.id}/authorisation`,
      { statusCode: 400 }
    ).as('AddAuthorisationFailure');

    onClerkTranslatorOverviewPage.navigateById(translatorResponse.id);
    cy.wait('@getClerkTranslatorOverview');

    onClerkTranslatorOverviewPage.clickAddAuthorisationBtn();

    onClerkTranslatorOverviewPage.inputAddAuthorisationField(
      'from',
      'input',
      'suomi'
    );

    onClerkTranslatorOverviewPage.saveAuthorisation();

    cy.wait('@AddAuthorisationFailure');

    cy.findByTestId('ErrorOutlineIcon');
  });
});

import { APIEndpoints } from 'enums/api';
import { AppRoutes, UIMode } from 'enums/app';
import { onClerkHomePage } from 'tests/cypress/support/page-objects/clerkHomePage';
import {
  existingTranslator,
  onClerkTranslatorOverviewPage,
} from 'tests/cypress/support/page-objects/clerkTranslatorOverviewPage';

const existingTranslatorId = 2;

beforeEach(() => {
  cy.intercept(APIEndpoints.ClerkTranslator, {
    fixture: 'clerk_translators_10.json',
  });

  cy.intercept(
    `${APIEndpoints.ClerkTranslator}/${existingTranslatorId}`,
    existingTranslator
  ).as('getClerkTranslatorOverview');
});

describe('ClerkTranslatorOverview:Page', () => {
  it("should be reachable from the ClerkTranslatorListing by a link on a translator's row", () => {
    cy.openClerkHomePage();
    onClerkHomePage.clickTranslatorOverviewLink(existingTranslatorId);

    onClerkTranslatorOverviewPage.expectedEnabledAddAuthorisationButton();
    onClerkTranslatorOverviewPage.expectEnabledEditTranslatorInfoBtn();
    onClerkTranslatorOverviewPage.expectTranslatorDetailsFields(
      existingTranslator
    );
    onClerkTranslatorOverviewPage.expectTranslatorAuthorisationDetails(
      existingTranslator
    );
  });

  it('should be reachable by directly navigating with a URL', () => {
    onClerkTranslatorOverviewPage.navigateById(existingTranslatorId);
    cy.wait('@getClerkTranslatorOverview');

    onClerkTranslatorOverviewPage.expectedEnabledAddAuthorisationButton();
    onClerkTranslatorOverviewPage.expectEnabledEditTranslatorInfoBtn();
    onClerkTranslatorOverviewPage.expectMode(UIMode.View);
    onClerkTranslatorOverviewPage.expectTranslatorDetailsFields(
      existingTranslator
    );
    onClerkTranslatorOverviewPage.expectTranslatorAuthorisationDetails(
      existingTranslator
    );
  });

  it('should display a "not found" message if no translator exists with the id given as the route parameter', () => {
    onClerkTranslatorOverviewPage.navigateById(1234567890);

    onClerkTranslatorOverviewPage.expectTranslatorNotFoundText();

    onClerkHomePage.expectTotalTranslatorsCount(10);
    cy.isOnPage(AppRoutes.ClerkHomePage);
  });

  it('should allow navigating back to ClerkHomePage by clicking on the back button', () => {
    onClerkTranslatorOverviewPage.navigateById(existingTranslator.id);
    cy.wait(['@getClerkTranslatorOverview']);
    onClerkTranslatorOverviewPage.navigateBackToRegister();

    onClerkHomePage.expectTotalTranslatorsCount(10);
    cy.isOnPage(AppRoutes.ClerkHomePage);
  });

  it('should go back onto the clerk home page when the back button of the browser is clicked', () => {
    cy.openClerkHomePage();
    onClerkHomePage.clickTranslatorOverviewLink(existingTranslatorId);

    cy.goBack();

    cy.isOnPage(AppRoutes.ClerkHomePage);
  });
});

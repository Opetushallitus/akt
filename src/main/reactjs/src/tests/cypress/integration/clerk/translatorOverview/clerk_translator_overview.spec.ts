import { APIEndpoints } from 'enums/api';
import { AppRoutes } from 'enums/app';
import { onClerkHomePage } from 'tests/cypress/support/page-objects/clerkHomePage';
import {
  apiTranslator,
  onClerkTranslatorOverviewPage,
} from 'tests/cypress/support/page-objects/clerkTranslatorOverviewPage';
import { useFixedDate } from 'tests/cypress/support/utils/date';

const fixedDateForTests = new Date('2022-01-17T12:35:00+0200');

beforeEach(() => {
  useFixedDate(fixedDateForTests);

  cy.intercept(APIEndpoints.ClerkTranslator, {
    fixture: 'clerk_translators_10.json',
  });

  cy.intercept(
    `${APIEndpoints.ClerkTranslator}/${apiTranslator.id}`,
    apiTranslator
  ).as('getClerkTranslatorOverview');
});

describe('ClerkTranslatorOverview:Page', () => {
  it("should be reachable from the ClerkTranslatorListing by a link on a translator's row", () => {
    cy.openClerkHomePage();
    onClerkHomePage.clickTranslatorOverviewLink(apiTranslator.id);

    onClerkTranslatorOverviewPage.expectedEnabledAddAuthorisationButton();
    onClerkTranslatorOverviewPage.expectEnabledEditTranslatorInfoBtn();
    onClerkTranslatorOverviewPage.expectTranslatorDetailsFields(apiTranslator);
    onClerkTranslatorOverviewPage.expectTranslatorAuthorisationDetails(
      apiTranslator
    );
  });

  it('should display a "not found" message if no translator exists with the id given as the route parameter', () => {
    onClerkTranslatorOverviewPage.navigateById(1234567890);

    onClerkTranslatorOverviewPage.expectTranslatorNotFoundText();

    onClerkHomePage.expectTotalTranslatorsCount(10);
    cy.isOnPage(AppRoutes.ClerkHomePage);
  });

  it('should allow navigating back to ClerkHomePage by clicking on the back button', () => {
    onClerkTranslatorOverviewPage.navigateById(apiTranslator.id);
    cy.wait('@getClerkTranslatorOverview');

    onClerkTranslatorOverviewPage.navigateBackToRegister();

    onClerkHomePage.expectTotalTranslatorsCount(10);
    cy.isOnPage(AppRoutes.ClerkHomePage);
  });

  it('should go back onto the clerk home page when the back button of the browser is clicked', () => {
    cy.openClerkHomePage();
    onClerkHomePage.clickTranslatorOverviewLink(apiTranslator.id);

    cy.goBack();

    cy.isOnPage(AppRoutes.ClerkHomePage);
  });
});

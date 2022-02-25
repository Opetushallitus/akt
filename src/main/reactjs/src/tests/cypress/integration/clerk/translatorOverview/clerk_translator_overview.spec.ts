import { APIEndpoints } from 'enums/api';
import { AppRoutes, UIMode } from 'enums/app';
import { onClerkHomePage } from 'tests/cypress/support/page-objects/clerkHomePage';
import { onClerkTranslatorOverviewPage } from 'tests/cypress/support/page-objects/clerkTranslatorOverviewPage';
import { useFixedDate } from 'tests/cypress/support/utils/date';

const fixedDateForTests = new Date('2022-01-17T12:35:00+0200');
const fakeTranslatorId = 1234567890;
const existingTranslatorId = 2;
let existingTranslator = undefined;

beforeEach(() => {
  useFixedDate(fixedDateForTests);
  cy.fixture('clerk_translators_100.json').then((clerkTranslatorsData) => {
    cy.intercept(APIEndpoints.ClerkTranslator, clerkTranslatorsData).as(
      'getClerkTranslators'
    );

    existingTranslator =
      clerkTranslatorsData.translators[existingTranslatorId - 1];

    cy.intercept(
      `${APIEndpoints.ClerkTranslator}/${existingTranslatorId}`,
      existingTranslator
    ).as('getClerkTranslatorOverview');
  });
});

describe('ClerkTranslatorOverview:Page', () => {
  it("should be reachable from the ClerkTranslatorListing by a link on a translator's row", () => {
    cy.openClerkHomePage();
    cy.wait('@getClerkTranslators');
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
    onClerkTranslatorOverviewPage.navigateById(fakeTranslatorId);

    onClerkTranslatorOverviewPage.expectTranslatorNotFoundText();
    onClerkHomePage.expectTotalTranslatorsCount(100);
  });

  it('should allow navigating back to ClerkHomePage by clicking on the back button', () => {
    onClerkTranslatorOverviewPage.navigateById(existingTranslator.id);
    cy.wait(['@getClerkTranslatorOverview']);
    onClerkTranslatorOverviewPage.navigateBackToRegister();

    cy.wait(['@getClerkTranslators']);
    onClerkHomePage.expectTotalTranslatorsCount(100);
  });

  it('should go back onto the clerk home page when the back button of the browser is clicked', () => {
    cy.openClerkHomePage();
    cy.wait('@getClerkTranslators');
    onClerkHomePage.clickTranslatorOverviewLink(existingTranslatorId);

    cy.goBack();

    cy.isOnPage(AppRoutes.ClerkHomePage);
  });
});

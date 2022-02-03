import { APIEndpoints } from 'enums/api';
import { onClerkHomePage } from 'tests/cypress/support/page-objects/clerkHomePage';
import {
  existingClerkTranslatorDetails,
  onClerkTranslatorDetailsPage,
} from 'tests/cypress/support/page-objects/clerkTranslatorDetailsPage';
import { useFixedDate } from 'tests/cypress/support/utils/date';

const fixedDateForTests = new Date('2022-01-17T12:35:00+0200');

beforeEach(() => {
  useFixedDate(fixedDateForTests);
  cy.intercept(APIEndpoints.ClerkTranslator, {
    fixture: 'clerk_translators_100.json',
  });
});

const fakeTranslatorId = 1234567890;

const expectTranslatorContactDetailsFields = () => {
  Object.keys(existingClerkTranslatorDetails.contactDetails).forEach(
    (field) => {
      const uiField = onClerkTranslatorDetailsPage.contactDetailsField(field);
      uiField.should(
        'have.value',
        existingClerkTranslatorDetails.contactDetails[field]
      );
      uiField.should('be.disabled');
    }
  );
};

const expectTranslatorAuthorisationDetails = () => {
  existingClerkTranslatorDetails.authorisations.forEach((a) => {
    const authorisationsRow =
      onClerkTranslatorDetailsPage.authorisationDetailsRow(a.id);
    authorisationsRow.should('contain.text', a.diaryNumber);
  });
};

describe('ClerkTranslatorDetails', () => {
  it("should be reachable from the ClerkTranslatorListing by a link on a translator's row", () => {
    cy.openClerkHomePage();
    onClerkHomePage.clickTranslatorDetailsLink(
      existingClerkTranslatorDetails.id
    );
    onClerkTranslatorDetailsPage.addAuthorisationBtn().should('be.enabled');
    onClerkTranslatorDetailsPage.editTranslatorInfoBtn().should('be.enabled');
    expectTranslatorContactDetailsFields();
    expectTranslatorAuthorisationDetails();
  });

  it('should be reachable by directly navigating with a URL', () => {
    onClerkTranslatorDetailsPage.navigateById(
      existingClerkTranslatorDetails.id
    );
    onClerkTranslatorDetailsPage.addAuthorisationBtn().should('be.enabled');
    onClerkTranslatorDetailsPage.editTranslatorInfoBtn().should('be.enabled');
    expectTranslatorContactDetailsFields();
    expectTranslatorAuthorisationDetails();
  });

  it('should display a "not found" message if no translator exists with the id given as the route parameter', () => {
    onClerkTranslatorDetailsPage.navigateById(fakeTranslatorId);
    onClerkTranslatorDetailsPage
      .contentContainer()
      .should('contain.text', 'Valittua kääntäjää ei löytynyt');
  });

  it('should allow navigating back to ClerkHomePage by clicking on the back button', () => {
    onClerkTranslatorDetailsPage.navigateById(
      existingClerkTranslatorDetails.id
    );
    onClerkTranslatorDetailsPage.backToRegisterBtn().click();
    onClerkHomePage.expectTotalTranslatorsCount(100);
  });
});

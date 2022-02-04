import { APIEndpoints } from 'enums/api';
import { ClerkTranslator } from 'interfaces/clerkTranslator';
import { onClerkHomePage } from 'tests/cypress/support/page-objects/clerkHomePage';
import { onClerkTranslatorDetailsPage } from 'tests/cypress/support/page-objects/clerkTranslatorDetailsPage';
import { useFixedDate } from 'tests/cypress/support/utils/date';

const fixedDateForTests = new Date('2022-01-17T12:35:00+0200');
const fakeTranslatorId = 1234567890;
const existingTranslatorId = 3;
let existingTranslatorDetails = undefined;

beforeEach(() => {
  useFixedDate(fixedDateForTests);
  cy.fixture('clerk_translators_100.json').then((clerkTranslatorsData) => {
    cy.intercept(APIEndpoints.ClerkTranslator, clerkTranslatorsData);
    const translatorDetails =
      clerkTranslatorsData.translators as Array<ClerkTranslator>;
    existingTranslatorDetails = translatorDetails.find(
      (translator) => translator.id === existingTranslatorId
    );
  });
});

const expectTranslatorContactDetailsFields = () => {
  Object.keys(existingTranslatorDetails.contactDetails).forEach((field) => {
    onClerkTranslatorDetailsPage.expectContactDetailsFieldValue(
      field,
      existingTranslatorDetails.contactDetails[field]
    );
    onClerkTranslatorDetailsPage.expectDisabledContactDetailsField(field);
  });
};

const expectTranslatorAuthorisationDetails = () => {
  existingTranslatorDetails.authorisations.forEach((a) => {
    onClerkTranslatorDetailsPage.expectAuthorisationRowToHaveText(
      a.id,
      a.diaryNumber
    );
  });
};

describe('ClerkTranslatorDetails', () => {
  it("should be reachable from the ClerkTranslatorListing by a link on a translator's row", () => {
    cy.openClerkHomePage();
    onClerkHomePage.clickTranslatorDetailsLink(existingTranslatorDetails.id);
    onClerkTranslatorDetailsPage.expectedEnabledAddAuthorisationButton();
    onClerkTranslatorDetailsPage.expectEnabledEditTranslatorInfoBtn();
    expectTranslatorContactDetailsFields();
    expectTranslatorAuthorisationDetails();
  });

  it('should be reachable by directly navigating with a URL', () => {
    onClerkTranslatorDetailsPage.navigateById(existingTranslatorDetails.id);
    onClerkTranslatorDetailsPage.expectedEnabledAddAuthorisationButton();
    onClerkTranslatorDetailsPage.expectEnabledEditTranslatorInfoBtn();
    expectTranslatorContactDetailsFields();
    expectTranslatorAuthorisationDetails();
  });

  it('should display a "not found" message if no translator exists with the id given as the route parameter', () => {
    onClerkTranslatorDetailsPage.navigateById(fakeTranslatorId);
    onClerkTranslatorDetailsPage.expectTranslatorNotFoundText();
  });

  it('should allow navigating back to ClerkHomePage by clicking on the back button', () => {
    onClerkTranslatorDetailsPage.navigateById(existingTranslatorDetails.id);
    onClerkTranslatorDetailsPage.navigateBackToRegister();
    onClerkHomePage.expectTotalTranslatorsCount(100);
  });
});

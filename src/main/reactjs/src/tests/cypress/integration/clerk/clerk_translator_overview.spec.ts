import { APIEndpoints } from 'enums/api';
import { ClerkTranslator } from 'interfaces/clerkTranslator';
import { onClerkHomePage } from 'tests/cypress/support/page-objects/clerkHomePage';
import { onClerkTranslatorOverviewPage } from 'tests/cypress/support/page-objects/clerkTranslatorOverviewPage';
import { useFixedDate } from 'tests/cypress/support/utils/date';

const fixedDateForTests = new Date('2022-01-17T12:35:00+0200');
const fakeTranslatorId = 1234567890;
const existingTranslatorId = 3;
let existingTranslator = undefined;

beforeEach(() => {
  useFixedDate(fixedDateForTests);
  cy.fixture('clerk_translators_100.json').then((clerkTranslatorsData) => {
    cy.intercept(APIEndpoints.ClerkTranslator, clerkTranslatorsData);
    const translators =
      clerkTranslatorsData.translators as Array<ClerkTranslator>;
    existingTranslator = translators.find(
      (translator) => translator.id === existingTranslatorId
    );
  });
});

const expectTranslatorDetailsFields = () => {
  const fields = [
    { field: 'firstName', fieldType: 'input' },
    { field: 'lastName', fieldType: 'input' },
    { field: 'identityNumber', fieldType: 'input' },
    { field: 'email', fieldType: 'input' },
    { field: 'phoneNumber', fieldType: 'input' },
    { field: 'street', fieldType: 'input' },
    { field: 'postalCode', fieldType: 'input' },
    { field: 'town', fieldType: 'input' },
    { field: 'country', fieldType: 'input' },
    { field: 'extraInformation', fieldType: 'textarea' },
  ];

  fields.forEach(({ field, fieldType }) => {
    const expectedValue = existingTranslator[field]
      ? existingTranslator[field]
      : '';

    onClerkTranslatorOverviewPage.expectTranslatorDetailsFieldValue(
      field,
      fieldType,
      expectedValue
    );
    onClerkTranslatorOverviewPage.expectDisabledTranslatorDetailsField(
      field,
      fieldType
    );
  });
};

const expectTranslatorAuthorisationDetails = () => {
  existingTranslator.authorisations.forEach((a) => {
    onClerkTranslatorOverviewPage.expectAuthorisationRowToHaveText(
      a.id,
      a.diaryNumber
    );
  });
};

describe('ClerkTranslatorDetails', () => {
  it("should be reachable from the ClerkTranslatorListing by a link on a translator's row", () => {
    cy.openClerkHomePage();
    onClerkHomePage.clickTranslatorOverviewLink(existingTranslator.id);
    onClerkTranslatorOverviewPage.expectedEnabledAddAuthorisationButton();
    onClerkTranslatorOverviewPage.expectEnabledEditTranslatorInfoBtn();
    expectTranslatorDetailsFields();
    expectTranslatorAuthorisationDetails();
  });

  it('should be reachable by directly navigating with a URL', () => {
    onClerkTranslatorOverviewPage.navigateById(existingTranslator.id);
    onClerkTranslatorOverviewPage.expectedEnabledAddAuthorisationButton();
    onClerkTranslatorOverviewPage.expectEnabledEditTranslatorInfoBtn();
    expectTranslatorDetailsFields();
    expectTranslatorAuthorisationDetails();
  });

  it('should display a "not found" message if no translator exists with the id given as the route parameter', () => {
    onClerkTranslatorOverviewPage.navigateById(fakeTranslatorId);
    onClerkTranslatorOverviewPage.expectTranslatorNotFoundText();
  });

  it('should allow navigating back to ClerkHomePage by clicking on the back button', () => {
    onClerkTranslatorOverviewPage.navigateById(existingTranslator.id);
    onClerkTranslatorOverviewPage.navigateBackToRegister();
    onClerkHomePage.expectTotalTranslatorsCount(100);
  });
});

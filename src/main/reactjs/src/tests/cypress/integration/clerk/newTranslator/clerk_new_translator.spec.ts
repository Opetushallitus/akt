import { APIEndpoints } from 'enums/api';
import { AppRoutes } from 'enums/app';
import { ClerkTranslatorTextField } from 'enums/clerkTranslator';
import { onAddAuthorisation } from 'tests/cypress/support/page-objects/addAuthorisation';
import { onClerkHomePage } from 'tests/cypress/support/page-objects/clerkHomePage';
import { onClerkNewTranslatorPage } from 'tests/cypress/support/page-objects/clerkNewTranslatorPage';
import { onClerkTranslatorOverviewPage } from 'tests/cypress/support/page-objects/clerkTranslatorOverviewPage';
import { runWithIntercept } from 'tests/cypress/support/utils/api';
import { useFixedDate } from 'tests/cypress/support/utils/date';
import { DateUtils } from 'utils/date';

beforeEach(() => {
  const dayjs = DateUtils.dayjs();
  const fixedDate = dayjs('2022-03-18');
  useFixedDate(fixedDate);

  runWithIntercept(
    APIEndpoints.MeetingDate,
    {
      fixture: 'meeting_dates_10.json',
    },
    () => cy.openClerkNewTranslatorPage()
  );
});

const expectRegistryIsVisible = () => {
  onClerkHomePage.elements.registryHeading().should('be.visible');
};

describe('ClerkNewTranslatorPage', () => {
  it('should bring user back to ClerkHomePage if cancel button is clicked', () => {
    onClerkNewTranslatorPage.cancel();
    expectRegistryIsVisible();
  });

  it('should show an error toast on error response from backend', () => {
    onClerkNewTranslatorPage.save();
    onClerkNewTranslatorPage.expectErrorToast();
  });

  it("should redirect to the created translator's details after saving", () => {
    // Fill in translator's basic information
    // TODO Reduce repetition?
    onClerkTranslatorOverviewPage.editTranslatorField(
      ClerkTranslatorTextField.LastName,
      'input',
      'Esimerkki'
    );
    onClerkTranslatorOverviewPage.editTranslatorField(
      ClerkTranslatorTextField.FirstName,
      'input',
      'Essi'
    );
    onClerkTranslatorOverviewPage.editTranslatorField(
      ClerkTranslatorTextField.IdentityNumber,
      'input',
      '999999-666I'
    );
    onClerkTranslatorOverviewPage.editTranslatorField(
      ClerkTranslatorTextField.Email,
      'input',
      'bad+example@test.invalid'
    );

    // Add authorisation
    onAddAuthorisation.selectFromLangByName('ruotsi');
    onAddAuthorisation.selectToLangByName('telugu');
    onAddAuthorisation.selectBasis('KKT');
    onAddAuthorisation.selectBeginDate('1.1.2022');
    onAddAuthorisation.expectEndDate('1.1.2027');
    onAddAuthorisation.setDiaryNumber('Testi12345');
    onAddAuthorisation.addCurrent();

    // Mock response on POST
    cy.intercept('POST', APIEndpoints.ClerkTranslator, {
      fixture: 'clerk_new_translator.json',
    });
    // Save details, expect success toast and redirect to details page
    onClerkNewTranslatorPage.save();
    onClerkNewTranslatorPage.expectSuccessToast();
    // Expect browser was redirected to page corresponding to ID within fixture
    cy.url().should(
      'include',
      AppRoutes.ClerkTranslatorOverviewPage.replace(/:translatorId$/i, '4916')
    );
  });
});

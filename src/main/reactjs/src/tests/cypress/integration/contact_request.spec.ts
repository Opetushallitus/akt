import { APIEndpoints } from 'enums/api';
import {
  expectTextForId,
  fillContactDetailsStep,
  onContactRequestForm,
  previewAndSendStep,
  TEST_TRANSLATOR_IDS,
  verifyTranslatorsStep,
  writeMessageStep,
} from 'tests/cypress/support/page-objects/contactRequestForm';
import { onPublicTranslatorFilters } from 'tests/cypress/support/page-objects/publicTranslatorFilters';
import { onPublicTranslatorsListing } from 'tests/cypress/support/page-objects/publicTranslatorsListing';
import { onCancelDialog } from 'tests/cypress/support/page-objects/cancelDialog';
import { onErrorDialog } from 'tests/cypress/support/page-objects/errorDialog';
import { onSuccessDialog } from 'tests/cypress/support/page-objects/successDialog';
import { runWithIntercept } from 'tests/cypress/support/utils/api';
import { onPublicHomePage } from 'tests/cypress/support/page-objects/publicHomePage';

const searchTranslatorsFromFiToSv = () => {
  onPublicTranslatorFilters.selectFromLang('suomi');
  onPublicTranslatorFilters.selectToLang('ruotsi');
  onPublicTranslatorFilters.search();
};

const selectTranslatorRows = () => {
  TEST_TRANSLATOR_IDS.forEach((id) =>
    onPublicTranslatorsListing.clickTranslatorRow(id)
  );
};

beforeEach(() => {
  runWithIntercept(
    APIEndpoints.PublicTranslator,
    { fixture: 'public_translators.json' },
    () => cy.openPublicHomePage()
  );
  searchTranslatorsFromFiToSv();
  selectTranslatorRows();
  onPublicTranslatorsListing.openContactRequest();
});

describe('ContactRequestForm', () => {
  it('should not allow proceeding if all translators are deselected', () => {
    onContactRequestForm.elements.nextButton().should('be.enabled');
    TEST_TRANSLATOR_IDS.forEach((id) =>
      onContactRequestForm.deselectTranslator(id)
    );
    onContactRequestForm.elements.nextButton().should('be.disabled');
  });

  it('should open a confirmation dialog when cancel button is clicked', () => {
    // Click on cancel, then back out => return to contact request form
    onContactRequestForm.cancel();
    onCancelDialog.expectText('Peruuta yhteydenottopyyntö');
    onCancelDialog.back();

    // Click on cancel, then confirm => return to home page
    onContactRequestForm.cancel();
    onCancelDialog.expectText('Peruuta yhteydenottopyyntö');
    onCancelDialog.yes();

    onPublicHomePage.isVisible();
  });

  it('should show an error dialog if the backend returns an error', () => {
    verifyTranslatorsStep();
    fillContactDetailsStep();
    writeMessageStep();
    previewAndSendStep();

    runWithIntercept(APIEndpoints.ContactRequest, { statusCode: 400 }, () =>
      onContactRequestForm.submit()
    );

    onErrorDialog.expectText('Virhe lähetettäessä yhteydenottopyyntöä.');
    onErrorDialog.back();

    // Verify last step is shown after dialog is closed
    expectTextForId(
      'contact-request-form__step-heading-previewAndSend',
      'Esikatsele ja lähetä'
    );
  });

  it('should show a success dialog in the end after happy path is completed', () => {
    verifyTranslatorsStep();
    fillContactDetailsStep();
    writeMessageStep();
    previewAndSendStep();

    runWithIntercept(APIEndpoints.ContactRequest, { statusCode: 200 }, () =>
      onContactRequestForm.submit()
    );

    onSuccessDialog.expectText(
      'Yhteydenottopyyntösi lähetettiin onnistuneesti!'
    );
    onSuccessDialog.continue();
    onPublicHomePage.isVisible();
  });
});

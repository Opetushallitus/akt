import { APIEndpoints } from 'enums/api';
import {
  LONG_TEST_MESSAGE,
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
  onPublicTranslatorFilters.filterByLanguagePair('suomi', 'ruotsi');
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

  // Form Validation Tests
  it('should show an error if the required contact fields are not filled out', () => {
    verifyTranslatorsStep();
    onContactRequestForm.next();

    onContactRequestForm.blurFieldByLabel(/etunimi/i);
    onContactRequestForm.blurFieldByLabel(/sukunimi/i);
    onContactRequestForm.blurFieldByLabel(/sähköpostiosoite/i);

    cy.findAllByText(/tieto on pakollinen/i).should('have.length', 3);
  });

  it('should show an error if the format of email and phone number fields are not correct', () => {
    verifyTranslatorsStep();
    onContactRequestForm.next();

    onContactRequestForm.fillFieldByLabel(
      /sähköpostiosoite/i,
      'wrong.email.com'
    );
    onContactRequestForm.fillFieldByLabel(
      /puhelinnumero/i,
      'wrong.phone.number'
    );
    onContactRequestForm.blurFieldByLabel(/puhelinnumero/i);

    cy.findByText(/sähköpostiosoite on virheellinen/i).should('be.visible');
    cy.findByText(/puhelinnumero on virheellinen/i).should('be.visible');
  });

  it('should show an error if the format of email and phone number fields are not correct', () => {
    verifyTranslatorsStep();
    onContactRequestForm.next();

    onContactRequestForm.fillFieldByLabel(
      /sähköpostiosoite/i,
      'wrong.email.com'
    );
    onContactRequestForm.fillFieldByLabel(
      /puhelinnumero/i,
      'wrong.phone.number'
    );
    onContactRequestForm.blurFieldByLabel(/puhelinnumero/i);

    onContactRequestForm.elements.nextButton().should('be.disabled');
    cy.findByText(/sähköpostiosoite on virheellinen/i).should('be.visible');
    cy.findByText(/puhelinnumero on virheellinen/i).should('be.visible');
  });

  it.only('should show an error if the message field is empty or its length exceeds the limit', () => {
    verifyTranslatorsStep();
    fillContactDetailsStep();
    onContactRequestForm.next();

    onContactRequestForm.blurFieldByLabel(/viesti/i);
    cy.findByText(/tieto on pakollinen/i).should('be.visible');
    onContactRequestForm.elements.nextButton().should('be.disabled');

    onContactRequestForm.pasteToFieldByLabel(/viesti/i, LONG_TEST_MESSAGE);
    onContactRequestForm.blurFieldByLabel(/viesti/i);

    cy.findByText(/tekstin pituus ei saa ylittää 1000 merkkiä/i).should(
      'be.visible'
    );
    onContactRequestForm.elements.nextButton().should('be.disabled');
  });
});

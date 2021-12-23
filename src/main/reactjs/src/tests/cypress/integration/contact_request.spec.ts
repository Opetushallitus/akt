import { Matcher } from '@testing-library/dom';

import { onContactRequestForm } from '../support/page-objects/contactRequestForm';
import { onPublicTranslatorFilters } from '../support/page-objects/publicTranslatorFilters';
import { onPublicTranslatorsListing } from '../support/page-objects/publicTranslatorsListing';
import { onCancelDialog } from '../support/page-objects/cancelDialog';
import { onErrorDialog } from '../support/page-objects/errorDialog';
import { onSuccessDialog } from '../support/page-objects/successDialog';
import { APIEndpoints } from 'enums/api';

const LOAD_PUBLIC_TRANSLATORS_API_CALL = 'loadPublicTranslators';
const SUBMIT_CONTACT_REQUEST_API_CALL = 'sendContactRequest';

const TRANSLATOR_NAMES_BY_IDS = {
  '2': 'Anneli Aaltonen',
  '4': 'Ella Eskola',
  '10': 'Liisa Hämäläinen',
};

const CONTACT_DETAILS = {
  firstName: 'Teemu',
  lastName: 'Testaaja',
  email: 'valid@email.org',
};

const MESSAGE = 'Kirjoita viestisi tähän';

const searchTranslatorsFromFiToSv = () => {
  onPublicTranslatorFilters.selectFromLang('suomi');
  onPublicTranslatorFilters.selectToLang('ruotsi');
  onPublicTranslatorFilters.search();
};

const selectTranslatorRows = () => {
  Object.keys(TRANSLATOR_NAMES_BY_IDS).forEach((id) =>
    onPublicTranslatorsListing.clickTranslatorRow(id)
  );
};

beforeEach(() => {
  cy.intercept(APIEndpoints.PublicTranslator, {
    fixture: 'public_translators.json',
  }).as(LOAD_PUBLIC_TRANSLATORS_API_CALL);

  cy.openPublicHomePage();
  cy.wait(`@${LOAD_PUBLIC_TRANSLATORS_API_CALL}`);

  searchTranslatorsFromFiToSv();
  selectTranslatorRows();
  onPublicTranslatorsListing.openContactRequest();
});

const expectText = (matcher: Matcher, text: string) =>
  cy.findByTestId(matcher).should('have.text', text);

const expectPublicHomepageIsShown = () => {
  expectText('homepage__title-heading', 'Auktorisoitujen kääntäjien rekisteri');
};

const assertSelectedTranslators = () => {
  expectText(
    'contact-request-form__chosen-translators-text',
    'Ella Eskola, Liisa Hämäläinen'
  );
};

const assertContactDetails = () => {
  expectText('contact-info__first-name-text', CONTACT_DETAILS.firstName);
  expectText('contact-info__last-name-text', CONTACT_DETAILS.lastName);
  expectText('contact-info__email-text', CONTACT_DETAILS.email);
};

const assertNextDisabled = () => {
  onContactRequestForm.elements.nextButton().should('be.disabled');
};

const assertNextEnabled = () => {
  onContactRequestForm.elements.nextButton().should('be.enabled');
};

const verifyTranslatorsStep = () => {
  onContactRequestForm.deselectTranslator('2');
};

const fillContactDetailsStep = () => {
  onContactRequestForm.next();
  assertNextDisabled();

  onContactRequestForm.fillFieldByLabel(/etunimi/i, CONTACT_DETAILS.firstName);
  onContactRequestForm.fillFieldByLabel(/sukunimi/i, CONTACT_DETAILS.lastName);
  onContactRequestForm.fillFieldByLabel(
    /sähköpostiosoite/i,
    CONTACT_DETAILS.email
  );

  assertNextEnabled();
};

const writeMessageStep = () => {
  onContactRequestForm.next();
  assertNextDisabled();

  onContactRequestForm.fillFieldByLabel(/kirjoita viestisi tähän/i, MESSAGE);

  assertNextEnabled();
};

describe('ContactRequestForm', () => {
  it('should not allow proceeding if all translators are deselected', () => {
    onContactRequestForm.elements.nextButton().should('be.enabled');
    Object.keys(TRANSLATOR_NAMES_BY_IDS).forEach((id) =>
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

    expectPublicHomepageIsShown();
  });

  it('should show an error dialog if the backend returns an error', () => {
    verifyTranslatorsStep();
    fillContactDetailsStep();
    writeMessageStep();

    // Step: preview and send
    onContactRequestForm.next();
    cy.intercept(APIEndpoints.ContactRequest, { statusCode: 400 }).as(
      SUBMIT_CONTACT_REQUEST_API_CALL
    );

    onContactRequestForm.submit();

    cy.wait(`@${SUBMIT_CONTACT_REQUEST_API_CALL}`);

    onErrorDialog.expectText('Virhe lähetettäessä yhteydenottopyyntöä.');
    onErrorDialog.back();

    // Verify last step is shown after dialog is closed
    expectText(
      'contact-request-form__step-heading-previewAndSend',
      'Esikatsele ja lähetä'
    );
  });

  it('should show a success dialog in the end after happy path is completed', () => {
    verifyTranslatorsStep();
    fillContactDetailsStep();
    writeMessageStep();

    // Step: preview and send
    onContactRequestForm.next();

    assertSelectedTranslators();
    assertContactDetails();

    cy.intercept(APIEndpoints.ContactRequest, { statusCode: 201 }).as(
      SUBMIT_CONTACT_REQUEST_API_CALL
    );

    onContactRequestForm.submit();

    cy.wait(`@${SUBMIT_CONTACT_REQUEST_API_CALL}`);

    onSuccessDialog.expectText(
      'Yhteydenottopyyntösi lähetettiin onnistuneesti!'
    );
    onSuccessDialog.continue();
    expectPublicHomepageIsShown();
  });
});

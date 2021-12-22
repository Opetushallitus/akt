import { Matcher } from '@testing-library/dom';

import { APIEndpoints } from 'enums/api';

const LOAD_PUBLIC_TRANSLATORS_API_CALL = 'loadPublicTranslators';
const SUBMIT_CONTACT_REQUEST_API_CALL = 'sendContactRequest';
const NEXT_BUTTON_ID = 'contact-request-form-controls-next-btn';
const CANCEL_BUTTON_ID = 'contact-request-form-controls-cancel-btn';
const SUBMIT_BUTTON_ID = 'contact-request-form-controls-submit-btn';
const SUCCESS_DIALOG_CONTINUE_BUTTON_ID = 'success-dialog-continue-btn';
const ERROR_DIALOG_CONTINUE_BUTTON_ID = 'error-dialog-back-btn';

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

const searchTranslatorsFromFiToSv = () => {
  cy.findByLabelText(/mistä/i).click();
  cy.findByRole('option', { name: 'suomi' }).click();
  cy.findByLabelText(/mihin/i).click();
  cy.findByRole('option', { name: 'ruotsi' }).click();

  cy.findByTestId('public-translator-search-btn').click();
};

const selectTranslatorRows = () => {
  Object.keys(TRANSLATOR_NAMES_BY_IDS).forEach((id) =>
    cy.findByTestId(`public-translator-row-id-${id}`).click()
  );

  expectText('public-translators-selected-count', '3 valittu');
};

beforeEach(() => {
  cy.intercept(APIEndpoints.PublicTranslator, {
    fixture: 'public_translators.json',
  }).as(LOAD_PUBLIC_TRANSLATORS_API_CALL);

  cy.visit('/');
  cy.wait(`@${LOAD_PUBLIC_TRANSLATORS_API_CALL}`);

  searchTranslatorsFromFiToSv();
  selectTranslatorRows();
  cy.findByTestId('public-translators-contact-request-btn').click();
});

const deselectTranslator = (id: string) => {
  cy.findByTestId(`contact-request-form-chosen-translator-id-${id}`)
    .findByTestId('DeleteOutlineIcon')
    .click();
};

const expectText = (matcher: Matcher, text: string) =>
  cy.findByTestId(matcher).should('have.text', text);

const expectPublicHomepageIsShown = () => {
  expectText('homepage-title', 'Auktorisoitujen kääntäjien rekisteri');
};

const fillContactDetails = () => {
  cy.findByLabelText(/etunimi/i).type(CONTACT_DETAILS.firstName);
  cy.findByLabelText(/sukunimi/i).type(CONTACT_DETAILS.lastName);
  cy.findByLabelText(/sähköpostiosoite/i).type(CONTACT_DETAILS.email);
};

const writeMessage = () => {
  cy.findByLabelText(/kirjoita viestisi tähän/i).type('Pyydetään käännösapua');
};

const nextStep = () => {
  cy.findByTestId(NEXT_BUTTON_ID).click();
};

describe('ContactRequestForm', () => {
  it('should not allow proceeding if all translators are deselected', () => {
    cy.findByTestId(NEXT_BUTTON_ID).should('be.enabled');
    Object.keys(TRANSLATOR_NAMES_BY_IDS).forEach(deselectTranslator);
    cy.findByTestId(NEXT_BUTTON_ID).should('be.disabled');
  });

  it('should open a confirmation dialog when cancel button is clicked', () => {
    cy.findByTestId(CANCEL_BUTTON_ID).click();
    let cancelDialog = cy.findByRole('dialog');
    cancelDialog.should('contain.text', 'Peruuta yhteydenottopyyntö');
    cancelDialog.findByTestId('cancel-dialog-back-btn').click();
    cancelDialog.should('not.exist');

    cy.findByTestId(CANCEL_BUTTON_ID).click();
    cancelDialog = cy.findByRole('dialog');
    cancelDialog.should('contain.text', 'Peruuta yhteydenottopyyntö');
    cancelDialog.findByTestId('cancel-dialog-yes-btn').click();
    expectPublicHomepageIsShown();
  });

  it('should show an error dialog if the backend returns an error', () => {
    // Step: verify selected translators
    nextStep();

    // Step: fill contact details
    fillContactDetails();
    nextStep();

    // Step: write message
    writeMessage();
    nextStep();

    // Step: preview and send
    cy.intercept(APIEndpoints.ContactRequest, { statusCode: 400 }).as(
      SUBMIT_CONTACT_REQUEST_API_CALL
    );
    cy.findByTestId(SUBMIT_BUTTON_ID).click();

    cy.wait(`@${SUBMIT_CONTACT_REQUEST_API_CALL}`);

    cy.findByRole('dialog').should(
      'contain.text',
      'Virhe lähetettäessä yhteydenottopyyntöä.'
    );

    cy.findByTestId(ERROR_DIALOG_CONTINUE_BUTTON_ID);

    // Verify last step is shown after dialog is closed
    expectText('step-heading-previewAndSend', 'Esikatsele ja lähetä');
  });

  it('should show a success dialog in the end after happy path is completed', () => {
    // Step: verify selected translators
    deselectTranslator('2');
    nextStep();

    // Step: fill contact details
    cy.findByTestId(NEXT_BUTTON_ID).should('be.disabled');
    fillContactDetails();
    nextStep();

    // Step: write message
    cy.findByTestId(NEXT_BUTTON_ID).should('be.disabled');
    writeMessage();
    nextStep();

    // Step: preview and send
    expectText(
      'contact-request-form-chosen-translators',
      'Ella Eskola, Liisa Hämäläinen'
    );

    expectText(
      'contact-request-form-contact-info-first-name',
      CONTACT_DETAILS.firstName
    );

    expectText(
      'contact-request-form-contact-info-last-name',
      CONTACT_DETAILS.lastName
    );

    expectText(
      'contact-request-form-contact-info-email',
      CONTACT_DETAILS.email
    );

    cy.intercept(APIEndpoints.ContactRequest, { statusCode: 201 }).as(
      SUBMIT_CONTACT_REQUEST_API_CALL
    );
    cy.findByTestId(SUBMIT_BUTTON_ID).click();

    cy.wait(`@${SUBMIT_CONTACT_REQUEST_API_CALL}`);

    cy.findByRole('dialog').should(
      'contain.text',
      'Yhteydenottopyyntösi lähetettiin onnistuneesti!'
    );

    cy.findByTestId(SUCCESS_DIALOG_CONTINUE_BUTTON_ID).click();
    expectPublicHomepageIsShown();
  });
});

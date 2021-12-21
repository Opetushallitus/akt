import { Matcher } from '@testing-library/dom';

import { APIEndpoints } from 'enums/api';

const LOAD_PUBLIC_TRANSLATORS_API_CALL = 'loadPublicTranslators';
const SUBMIT_CONTACT_REQUEST_API_CALL = 'sendContactRequest';

beforeEach(() => {
  cy.intercept(APIEndpoints.PublicTranslator, {
    fixture: 'public_translators.json',
  }).as(LOAD_PUBLIC_TRANSLATORS_API_CALL);

  cy.visit('/');
  cy.wait(`@${LOAD_PUBLIC_TRANSLATORS_API_CALL}`);
});

const expectText = (matcher: Matcher, text: string) =>
  cy.findByTestId(matcher).should('have.text', text);

describe('ContactRequestForm', () => {
  it('should be opened when translators are selected and request contact button is clicked', () => {
    cy.findByLabelText(/mistä/i).click();
    cy.findByRole('option', { name: 'suomi' }).click();
    cy.findByLabelText(/mihin/i).click();
    cy.findByRole('option', { name: 'ruotsi' }).click();

    cy.findByTestId('public-translator-search-btn').click();
    [2, 4, 10].forEach((id) =>
      cy.findByTestId(`public-translator-row-id-${id}`).click()
    );

    expectText('public-translators-selected-count', '3 valittu');

    cy.findByTestId('public-translators-contact-request-btn').click();
    cy.findByTestId('contact-request-form-chosen-translator-id-2')
      .findByTestId('DeleteOutlineIcon')
      .click();

    cy.findByTestId('contact-request-form-controls-next-btn').click();

    cy.findByTestId('contact-request-form-controls-next-btn').should(
      'be.disabled'
    );
    const contactDetails = {
      firstName: 'Teemu',
      lastName: 'Testaaja',
      email: 'valid@email.org',
    };
    cy.findByLabelText(/etunimi/i).type(contactDetails.firstName);
    cy.findByLabelText(/sukunimi/i).type(contactDetails.lastName);
    cy.findByLabelText(/sähköpostiosoite/i).type(contactDetails.email);
    cy.findByTestId('contact-request-form-controls-next-btn').click();

    cy.findByTestId('contact-request-form-controls-next-btn').should(
      'be.disabled'
    );
    cy.findByLabelText(/kirjoita viestisi tähän/i).type(
      'Pyydetään käännösapua'
    );
    cy.findByTestId('contact-request-form-controls-next-btn').click();

    expectText(
      'contact-request-form-chosen-translators',
      'Ella Eskola, Liisa Hämäläinen'
    );

    expectText(
      'contact-request-form-contact-info-first-name',
      contactDetails.firstName
    );

    expectText(
      'contact-request-form-contact-info-last-name',
      contactDetails.lastName
    );

    expectText('contact-request-form-contact-info-email', contactDetails.email);

    cy.intercept(APIEndpoints.ContactRequest, { statusCode: 201 }).as(
      SUBMIT_CONTACT_REQUEST_API_CALL
    );
    cy.findByTestId('contact-request-form-controls-submit-btn').click();

    cy.wait(`@${SUBMIT_CONTACT_REQUEST_API_CALL}`);

    cy.findByRole('dialog').should(
      'contain.text',
      'Yhteydenottopyyntösi lähetettiin onnistuneesti!'
    );

    cy.findByTestId('success-dialog-continue-btn').click();
  });
});

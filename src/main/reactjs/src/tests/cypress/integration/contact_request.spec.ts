import { Matcher } from '@testing-library/dom';
import { RouteHandler } from 'cypress/types/net-stubbing';

import { onContactRequestForm } from '../support/page-objects/contactRequestForm';
import { onPublicTranslatorFilters } from '../support/page-objects/publicTranslatorFilters';
import { onPublicTranslatorsListing } from '../support/page-objects/publicTranslatorsListing';
import { onCancelDialog } from '../support/page-objects/cancelDialog';
import { onErrorDialog } from '../support/page-objects/errorDialog';
import { onSuccessDialog } from '../support/page-objects/successDialog';
import { APIEndpoints } from 'enums/api';

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

const runWithIntercept = (
  endpoint: APIEndpoints,
  response: RouteHandler,
  effect: () => void
) => {
  const alias = `intercepted-${endpoint}`;
  cy.intercept(endpoint, response).as(alias);
  effect();
  cy.wait(`@${alias}`);
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

const previewAndSendStep = () => {
  onContactRequestForm.next();

  assertSelectedTranslators();
  assertContactDetails();
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
    previewAndSendStep();

    runWithIntercept(APIEndpoints.ContactRequest, { statusCode: 400 }, () =>
      onContactRequestForm.submit()
    );

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
    previewAndSendStep();

    runWithIntercept(APIEndpoints.ContactRequest, { statusCode: 200 }, () =>
      onContactRequestForm.submit()
    );

    onSuccessDialog.expectText(
      'Yhteydenottopyyntösi lähetettiin onnistuneesti!'
    );
    onSuccessDialog.continue();
    expectPublicHomepageIsShown();
  });
});

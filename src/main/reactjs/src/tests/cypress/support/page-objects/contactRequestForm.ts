import { Matcher } from '@testing-library/dom';

class ContactRequestForm {
  elements = {
    deselectTranslatorButton: (id: string) =>
      cy
        .findByTestId(`contact-request-form__chosen-translator-id-${id}`)
        .findByTestId('DeleteOutlineIcon'),
    previousButton: () => cy.findByTestId('contact-request-form__previous-btn'),
    nextButton: () => cy.findByTestId('contact-request-form__next-btn'),
    cancelButton: () => cy.findByTestId('contact-request-form__cancel-btn'),
    submitButton: () => cy.findByTestId('contact-request-form__submit-btn'),
    byLabel: (label: Matcher) => cy.findByLabelText(label),
  };

  previous() {
    this.elements.previousButton().click();
  }

  next() {
    this.elements.nextButton().click();
  }

  cancel() {
    this.elements.cancelButton().click();
  }

  submit() {
    this.elements.submitButton().click();
  }

  deselectTranslator(id: string) {
    this.elements.deselectTranslatorButton(id).click();
  }

  fillFieldByLabel(label: Matcher, text: string) {
    this.elements.byLabel(label).type(text);
  }

  pasteToFieldByLabel(label: Matcher, text: string) {
    this.elements.byLabel(label).clear().invoke('val', text).trigger('input');
  }

  blurFieldByLabel(label: Matcher) {
    this.elements.byLabel(label).focus().blur();
  }

  isNextEnabled() {
    this.elements.nextButton().should('be.enabled');
  }

  isNextDisabled() {
    this.elements.nextButton().should('be.disabled');
  }
}

export const TEST_TRANSLATOR_IDS = ['602', '1940', '2080'];

export const TEST_CONTACT_DETAILS = {
  firstName: 'Teemu',
  lastName: 'Testaaja',
  email: 'valid@email.org',
};
export const TEST_MESSAGE = 'Kirjoita viestisi tähän';
export const LONG_TEST_MESSAGE = TEST_MESSAGE.repeat(50);

export const onContactRequestForm = new ContactRequestForm();

export const verifyTranslatorsStep = () => {
  onContactRequestForm.deselectTranslator('1940');
};

export const fillContactDetailsStep = () => {
  onContactRequestForm.next();
  onContactRequestForm.isNextDisabled();

  onContactRequestForm.fillFieldByLabel(
    /etunimi/i,
    TEST_CONTACT_DETAILS.firstName
  );
  onContactRequestForm.fillFieldByLabel(
    /sukunimi/i,
    TEST_CONTACT_DETAILS.lastName
  );
  onContactRequestForm.fillFieldByLabel(
    /sähköpostiosoite/i,
    TEST_CONTACT_DETAILS.email
  );

  onContactRequestForm.isNextEnabled();
};

export const writeMessageStep = () => {
  onContactRequestForm.next();
  onContactRequestForm.isNextDisabled();

  onContactRequestForm.fillFieldByLabel(/Viesti/i, TEST_MESSAGE);

  onContactRequestForm.isNextEnabled();
};

const assertSelectedTranslators = () => {
  expectTextForId(
    'contact-request-form__chosen-translators-text',
    'Ilkka Heinonen, Ninni Korhonen'
  );
};

const assertContactDetails = () => {
  expectTextForId(
    'contact-info__first-name-text',
    TEST_CONTACT_DETAILS.firstName
  );
  expectTextForId(
    'contact-info__last-name-text',
    TEST_CONTACT_DETAILS.lastName
  );
  expectTextForId('contact-info__email-text', TEST_CONTACT_DETAILS.email);
};

export const previewAndSendStep = () => {
  onContactRequestForm.next();

  assertSelectedTranslators();
  assertContactDetails();
};

export const expectTextForId = (id: Matcher, text: string) =>
  cy.findByTestId(id).should('have.text', text);

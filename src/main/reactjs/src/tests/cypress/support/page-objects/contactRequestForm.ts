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
}

export const onContactRequestForm = new ContactRequestForm();

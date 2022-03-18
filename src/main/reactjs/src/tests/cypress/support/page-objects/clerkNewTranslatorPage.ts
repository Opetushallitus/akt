import { onToast } from 'tests/cypress/support/page-objects/toast';

class ClerkNewTranslatorPage {
  elements = {
    cancelBtn: () => cy.findByTestId('clerk-new-translator-page__cancel-btn'),
    saveBtn: () => cy.findByTestId('clerk-new-translator-page__save-btn'),
  };

  cancel() {
    this.elements.cancelBtn().click();
  }

  save() {
    this.elements.saveBtn().click();
  }

  expectErrorToast() {
    onToast.expectText('Kääntäjän lisääminen ei onnistunut!');
  }

  expectSuccessToast() {
    onToast.expectText('Kääntäjän tiedot tallennettiin!');
  }
}

export const onClerkNewTranslatorPage = new ClerkNewTranslatorPage();

class SuccessDialog {
  elements = {
    continueButton: () => cy.findByTestId('success-dialog__continue-btn'),
  };

  continue() {
    this.elements.continueButton().click();
  }

  expectText(text: string) {
    cy.findByRole('dialog').should('contain.text', text);
  }
}

export const onSuccessDialog = new SuccessDialog();

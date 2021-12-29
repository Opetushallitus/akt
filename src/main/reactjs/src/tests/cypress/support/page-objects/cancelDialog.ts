class CancelDialog {
  elements = {
    backButton: () => cy.findByTestId('cancel-dialog__back-btn'),
    yesButton: () => cy.findByTestId('cancel-dialog__yes-btn'),
  };

  back() {
    this.elements.backButton().click();
  }

  yes() {
    this.elements.yesButton().click();
  }

  expectText(text: string) {
    cy.findByRole('dialog').should('contain.text', text);
  }
}

export const onCancelDialog = new CancelDialog();

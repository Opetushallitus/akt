class ErrorDialog {
  elements = {
    backButton: () => cy.findByTestId('error-dialog__back-btn'),
  };

  back() {
    this.elements.backButton().click();
  }

  expectText(text: string) {
    cy.findByRole('dialog').should('contain.text', text);
  }
}

export const onErrorDialog = new ErrorDialog();

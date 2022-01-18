import { AuthorisationStatus } from 'enums/clerkTranslator';

class ClerkHomePage {
  elements = {
    registryHeading: () =>
      cy.findByTestId('clerk-translator-registry__heading'),
    authorisationStatusButton: (status: AuthorisationStatus) =>
      cy.findByTestId(`clerk-translator-filters__btn--${status}`),
    sendEmailButton: () =>
      cy.findByTestId('clerk-translator-registry__send-email-btn'),
    translatorRow: (id: string) =>
      cy.findByTestId(`clerk-translators__id-${id}-row`),
  };

  expectTotalTranslatorsCount(count: number) {
    this.elements
      .registryHeading()
      .should('contain.text', `Rekisteri(${count})`);
  }

  expectSelectedTranslatorsCount(count: number) {
    cy.get('.table__head-box__pagination').should('contain.text', `/ ${count}`);
  }

  filterByAuthorisationStatus(status: AuthorisationStatus) {
    this.elements.authorisationStatusButton(status).click();
  }

  sendEmail() {
    this.elements.sendEmailButton().click();
  }

  selectTranslatorById(id: string) {
    this.elements.translatorRow(id).click();
  }
}

export const onClerkHomePage = new ClerkHomePage();

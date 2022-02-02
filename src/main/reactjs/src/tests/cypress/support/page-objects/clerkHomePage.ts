import { AuthorisationStatus } from 'enums/clerkTranslator';
import { AuthorisationBasis } from 'interfaces/authorisation';

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
    authorisationBasisSelect: () =>
      cy.findByTestId('clerk-translator-filters__authorisation-basis'),
    fromLanguageSelect: () =>
      cy.findByTestId('clerk-translator-filters__from-lang'),
    toLanguageSelect: () =>
      cy.findByTestId('clerk-translator-filters__to-lang'),
    nameField: () => cy.findByTestId('clerk-translator-filters__name'),
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

  filterByAuthorisationBasis(basis: AuthorisationBasis) {
    this.elements.authorisationBasisSelect().type(basis + '{enter}');
  }

  filterByFromLang(lang: string) {
    this.elements.fromLanguageSelect().type(lang + '{enter}');
  }

  filterByToLang(lang: string) {
    this.elements.fromLanguageSelect().type(lang + '{enter}');
  }

  filterByName(name: string) {
    this.elements.nameField().type(name);
  }

  sendEmail() {
    this.elements.sendEmailButton().click();
  }

  selectTranslatorById(id: string) {
    this.elements.translatorRow(id).click();
  }
}

export const onClerkHomePage = new ClerkHomePage();

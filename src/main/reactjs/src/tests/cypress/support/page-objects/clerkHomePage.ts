import { AuthorisationStatus } from 'enums/clerkTranslator';
import { AuthorisationBasis } from 'interfaces/authorisation';
import { selectOption } from 'tests/cypress/support/utils/option';

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
    authorisationBasisDropdown: () =>
      cy.findByTestId('clerk-translator-filters__authorisation-basis'),
    fromLanguageDropdown: () =>
      cy.findByTestId('clerk-translator-filters__from-lang'),
    toLanguageDropdown: () =>
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
    this.elements.authorisationBasisDropdown().click();
    selectOption(basis);
  }

  filterByFromLang(lang: string) {
    this.elements.fromLanguageDropdown().click();
    selectOption(lang);
  }

  filterByToLang(lang: string) {
    this.elements.toLanguageDropdown().click();
    selectOption(lang);
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

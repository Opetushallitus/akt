import { PermissionToPublish } from 'enums/app';
import { AuthorisationStatus } from 'enums/clerkTranslator';
import { AuthorisationBasis } from 'interfaces/authorisation';

class ClerkHomePage {
  elements = {
    clerkNavTabRegister: () => cy.findByTestId('clerk-nav-tab__register'),
    clerkNavTabMeetingDates: () =>
      cy.findByTestId('clerk-nav-tab__meeting-dates'),
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
    permissionToPublishBasisSelect: () =>
      cy.findByTestId('clerk-translator-filters__permission-to-publish-basis'),
    clearPermissionToPublishBasisSelect: () =>
      cy
        .findByTestId('clerk-translator-filters__permission-to-publish-basis')
        .type('Kyllä' + '{enter}')
        .findByTestId('CloseIcon')
        .parent(),
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

  expectClerkHeaderToBe(title: string) {
    this.elements.registryHeading().should('contain.text', title);
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

  filterByPermissonToPublishBasis(basis: keyof typeof PermissionToPublish) {
    this.elements.permissionToPublishBasisSelect().type(basis + '{enter}');
  }

  clearFilterByPermissonToPublishBasis() {
    this.elements.clearPermissionToPublishBasisSelect().click();
  }

  filterByFromLang(lang: string) {
    this.elements.fromLanguageSelect().type(lang + '{enter}');
  }

  filterByToLang(lang: string) {
    this.elements.toLanguageSelect().type(lang + '{enter}');
  }

  filterByName(name: string) {
    this.elements.nameField().type(name);
  }

  sendEmail() {
    this.elements.sendEmailButton().click();
  }

  navigateClerkNavTabRegister() {
    this.elements.clerkNavTabRegister().click();
  }

  navigateClerkNavTabMeetingDates() {
    this.elements.clerkNavTabMeetingDates().click();
  }

  selectTranslatorById(id: string) {
    this.elements.translatorRow(id).click();
  }

  clickTranslatorOverviewLink(id: number) {
    this.elements
      .translatorRow(`${id}`)
      .findByTestId(`clerk-translators__id-${id}-more-btn`)
      .click({ force: true });
  }
}

export const onClerkHomePage = new ClerkHomePage();

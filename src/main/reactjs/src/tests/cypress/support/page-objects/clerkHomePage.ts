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
    permissionToPublishBasisSelect: () =>
      cy.findByTestId('clerk-translator-filters__permission-to-publish-basis'),
    fromLanguageSelect: () =>
      cy.findByTestId('clerk-translator-filters__from-lang'),
    toLanguageSelect: () =>
      cy.findByTestId('clerk-translator-filters__to-lang'),
    nameField: () => cy.findByTestId('clerk-translator-filters__name'),
    addNewTranslatorButton: () => cy.findByTestId('add-new-translator'),
    newTranslatorBasicInformationField: (field: string, fieldType: string) =>
      cy
        .findByTestId(`new-translator__basic-information__${field}`)
        .find(`div>${fieldType}`),
    newTranslatorBasicInformationExtraInformation: () =>
      cy.findByTestId(`new-translator__basic-information__extraInformation`),
    newTranslatorAssuranceToggleButton: () =>
      cy.get(
        '[data-testid="new-translator__basic-information__assurance-toggle-button"] > .MuiTypography-root'
      ),
    addAuthorisationField: (
      field: string,
      fieldType: string,
      isDatePicker = false
    ) =>
      cy
        .findByTestId(
          `add-authorisation-field-${field}${
            isDatePicker ? '__date-picker' : ''
          }`
        )
        .find(`div>${fieldType}`),
    addAuthorisationButton: () =>
      cy.findByTestId('clerk-new-translator-page__add-authorisation-button'),
    addAuthorisationModalAddButton: () =>
      cy.findByTestId('add-authorisation-modal__save'),
    saveNewClerkButton: () =>
      cy.findByTestId('clerk-new-translator-page__save-new-clerk-button'),
    getAuthorisationRow: (id: number) =>
      cy.findByTestId(`authorisations-table__id-${id}-unsaved-row`),
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

  filterByPermissionToPublishBasis(permissionToPublish: boolean) {
    const basis = permissionToPublish ? 'Kyllä' : 'Ei';
    this.elements.permissionToPublishBasisSelect().type(basis + '{enter}');
  }

  filterByFromLang(lang: string) {
    this.elements.fromLanguageSelect().type(lang + '{enter}');
  }

  filterByToLang(lang: string) {
    this.elements.toLanguageSelect().type(lang + '{enter}');
  }

  filterByName(name: string) {
    this.elements.nameField().type(name + '{enter}');
    // Ensure debounced name filter gets applied by waiting for more than 300ms
    cy.tick(400);
  }

  sendEmail() {
    this.elements.sendEmailButton().click();
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

  clickAddNewTranslatorButton() {
    this.elements.addNewTranslatorButton().click();
  }

  inputNewTranslatorBasicInformationField(
    fieldName: string,
    fieldType: string,
    newValue
  ) {
    this.elements
      .newTranslatorBasicInformationField(fieldName, fieldType)
      .clear()
      .should('have.text', '')
      .type(newValue);
  }

  inputNewTranslatorBasicInformationExtraInformation(newValue) {
    this.elements
      .newTranslatorBasicInformationExtraInformation()
      .type(newValue);
  }

  fillOutAddAuthorisationField(
    fieldName: string,
    fieldType: string,
    newValue: string
  ) {
    this.elements
      .addAuthorisationField(fieldName, fieldType)
      .clear()
      .type(`${newValue}{enter}`);
  }

  clickNewTranslatorAssuranceToggleButton() {
    this.elements
      .newTranslatorAssuranceToggleButton()
      .should('be.visible')
      .click();
  }

  clickAddAuthorisationButton() {
    this.elements.addAuthorisationButton().click();
  }

  addAuthorisation() {
    this.elements.addAuthorisationModalAddButton().should('be.visible').click();
  }

  clickSaveNewClerkButton() {
    this.elements.saveNewClerkButton().should('be.visible').click();
  }

  expectAuthorisationRowToExist(id: number) {
    this.elements.getAuthorisationRow(id).should('exist');
  }
}

export const onClerkHomePage = new ClerkHomePage();

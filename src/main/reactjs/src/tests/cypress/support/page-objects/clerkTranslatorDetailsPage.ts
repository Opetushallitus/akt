import { AppRoutes } from 'enums/app';

class ClerkTranslatorDetailsPage {
  elements = {
    addAuthorisationBtn: () =>
      cy.findByTestId(
        'clerk-translator-details__authorisation-details__add-btn'
      ),
    authorisationRow: (id: number) =>
      cy.findByTestId(`authorisations-table__id-${id}-row`),
    backToRegisterBtn: () => cy.get('.clerk-translator-details-page__back-btn'),
    editTranslatorInfoBtn: () =>
      cy.findByTestId('clerk-translator-details__translator-details__edit-btn'),
    contentContainer: () =>
      cy.get('.clerk-translator-details-page__content-container'),
    translatorDetailsField: (field: string) =>
      cy
        .findByTestId(
          `clerk-translator-details__translator-details__field-${field}`
        )
        .find('div>input'),
  };

  navigateById(id: number) {
    cy.visit(
      AppRoutes.ClerkTranslatorDetailsPage.replace(/:translatorId$/, `${id}`)
    );
  }

  navigateBackToRegister() {
    this.elements.backToRegisterBtn().click();
  }

  expectTranslatorDetailsFieldValue(field: string, value: string) {
    this.elements.translatorDetailsField(field).should('have.value', value);
  }

  expectDisabledTranslatorDetailsField(field: string) {
    this.elements.translatorDetailsField(field).should('be.disabled');
  }

  expectEnabledEditTranslatorInfoBtn() {
    this.elements.editTranslatorInfoBtn().should('be.enabled');
  }

  expectedEnabledAddAuthorisationButton() {
    this.elements.addAuthorisationBtn().should('be.enabled');
  }

  expectAuthorisationRowToHaveText(id: number, text: string) {
    this.elements.authorisationRow(id).should('contain.text', text);
  }

  expectTranslatorNotFoundText() {
    this.elements
      .contentContainer()
      .should('contain.text', 'Valittua kääntäjää ei löytynyt');
  }
}

export const onClerkTranslatorDetailsPage = new ClerkTranslatorDetailsPage();

import { AppRoutes } from 'enums/app';

class ClerkTranslatorOverviewPage {
  elements = {
    addAuthorisationBtn: () =>
      cy.findByTestId(
        'clerk-translator-overview__authorisation-details__add-btn'
      ),
    authorisationRow: (id: number) =>
      cy.findByTestId(`authorisations-table__id-${id}-row`),
    backToRegisterBtn: () =>
      cy.get('.clerk-translator-overview-page__back-btn'),
    editTranslatorInfoBtn: () =>
      cy.findByTestId(
        'clerk-translator-overview__translator-details__edit-btn'
      ),
    contentContainer: () =>
      cy.get('.clerk-translator-overview-page__content-container'),
    translatorDetailsField: (field: string, fieldType: string) =>
      cy
        .findByTestId(
          `clerk-translator-overview__translator-details__field-${field}`
        )
        .find(`div>${fieldType}`),
  };

  navigateById(id: number) {
    cy.visit(
      AppRoutes.ClerkTranslatorOverviewPage.replace(/:translatorId$/, `${id}`)
    );
  }

  navigateBackToRegister() {
    this.elements.backToRegisterBtn().click();
  }

  expectTranslatorDetailsFieldValue(
    field: string,
    fieldType: string,
    value: string
  ) {
    this.elements
      .translatorDetailsField(field, fieldType)
      .should('have.value', value);
  }

  expectDisabledTranslatorDetailsField(field: string, fieldType: string) {
    this.elements
      .translatorDetailsField(field, fieldType)
      .should('be.disabled');
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

export const onClerkTranslatorOverviewPage = new ClerkTranslatorOverviewPage();

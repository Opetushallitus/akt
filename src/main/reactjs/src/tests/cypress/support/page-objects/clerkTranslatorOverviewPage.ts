import { AppRoutes, UIMode } from 'enums/app';
import { AuthorisationStatus } from 'enums/clerkTranslator';
import { ClerkTranslatorResponse } from 'interfaces/clerkTranslator';
import { onToast } from 'tests/cypress/support/page-objects/toast';
import { APIUtils } from 'utils/api';
import { AuthorisationUtils } from 'utils/authorisation';

class ClerkTranslatorOverviewPage {
  elements = {
    authorisedToggleBtn: () =>
      cy.findByTestId(
        'clerk-translator-overview__authorisation-details__toggle-btn--authorised'
      ),
    expiredToggleBtn: () =>
      cy.findByTestId(
        'clerk-translator-overview__authorisation-details__toggle-btn--expired'
      ),
    formerVIRToggleBtn: () =>
      cy.findByTestId(
        'clerk-translator-overview__authorisation-details__toggle-btn--formerVIR'
      ),
    addAuthorisationBtn: () =>
      cy.findByTestId(
        'clerk-translator-overview__authorisation-details__add-btn'
      ),
    authorisationRow: (id: number) =>
      cy.findByTestId(`authorisations-table__id-${id}-row`),
    authorisationRowPublishSwitch: (id: number) =>
      cy
        .findByTestId(`authorisations-table__id-${id}-row`)
        .get('input[type=checkbox]'),
    authorisationRowDeleteBtn: (id: number) =>
      cy.findByTestId(`authorisations-table__id-${id}-row__delete-btn`),
    backToRegisterBtn: () =>
      cy.findByTestId('clerk-translator-overview-page__back-btn'),
    editTranslatorInfoBtn: () =>
      cy.findByTestId(
        'clerk-translator-overview__translator-details__edit-btn'
      ),
    cancelTranslatorInfoBtn: () =>
      cy.findByTestId(
        'clerk-translator-overview__translator-details__cancel-btn'
      ),
    saveTranslatorInfoBtn: () =>
      cy.findByTestId(
        'clerk-translator-overview__translator-details__save-btn'
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
    this.elements.backToRegisterBtn().should('be.visible').click();
  }

  clickEditTranslatorInfoBtn() {
    this.elements.editTranslatorInfoBtn().should('be.visible').click();
  }

  clickCancelTranslatorInfoBtn() {
    this.elements.cancelTranslatorInfoBtn().should('be.visible').click();
  }

  clickSaveTranslatorInfoBtn() {
    this.elements.saveTranslatorInfoBtn().should('be.visible').click();
  }

  editTranslatorField(fieldName: string, fieldType: string, newValue) {
    this.elements
      .translatorDetailsField(fieldName, fieldType)
      .clear()
      .should('have.text', '')
      .type(newValue);
  }

  clickAuthorisedToggleBtn() {
    this.elements.authorisedToggleBtn().click();
  }

  clickExpiredToggleBtn() {
    this.elements.expiredToggleBtn().click();
  }

  clickformerVIRToggleBtn() {
    this.elements.formerVIRToggleBtn().click();
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

  expectAuthorisationRowPublishPermission(
    id: number,
    publishPermission: boolean
  ) {
    this.elements
      .authorisationRowPublishSwitch(id)
      .should('have.value', publishPermission);
  }

  changeAuthorisationRowPublishPermission(id: number) {
    this.elements.authorisationRowPublishSwitch(id).check();
  }

  clickAuthorisationRowDeleteButton(id: number) {
    this.elements.authorisationRowDeleteBtn(id).click();
  }

  expectTranslatorNotFoundText() {
    onToast.expectText('Valittua kääntäjää ei löytynyt');
  }

  expectMode(mode: UIMode) {
    switch (mode) {
      case UIMode.View:
        this.elements.addAuthorisationBtn().should('be.visible');
        this.elements.editTranslatorInfoBtn().should('be.visible');
        break;
      case UIMode.EditTranslatorDetails:
        this.elements.cancelTranslatorInfoBtn().should('be.visible');
        break;
      case UIMode.EditAuthorisationDetails:
        // not implemented yet
        assert(false);
    }
  }

  expectTranslatorDetailsFields(translator: ClerkTranslatorResponse) {
    const fields = [
      { field: 'firstName', fieldType: 'input' },
      { field: 'lastName', fieldType: 'input' },
      { field: 'identityNumber', fieldType: 'input' },
      { field: 'email', fieldType: 'input' },
      { field: 'phoneNumber', fieldType: 'input' },
      { field: 'street', fieldType: 'input' },
      { field: 'postalCode', fieldType: 'input' },
      { field: 'town', fieldType: 'input' },
      { field: 'country', fieldType: 'input' },
      { field: 'extraInformation', fieldType: 'textarea' },
    ];

    fields.forEach(({ field, fieldType }) => {
      const expectedValue = translator[field] ? translator[field] : '';

      onClerkTranslatorOverviewPage.expectTranslatorDetailsFieldValue(
        field,
        fieldType,
        expectedValue
      );
      onClerkTranslatorOverviewPage.expectDisabledTranslatorDetailsField(
        field,
        fieldType
      );
    });
  }

  expectAuthorisations(
    translator: ClerkTranslatorResponse,
    status: AuthorisationStatus
  ) {
    const convertedTranslator =
      APIUtils.convertClerkTranslatorResponse(translator);
    const authorisations =
      AuthorisationUtils.groupClerkTranslatorAuthorisationsByStatus(
        convertedTranslator
      );

    authorisations[status].forEach((a) => {
      onClerkTranslatorOverviewPage.expectAuthorisationRowToHaveText(
        a.id,
        a.diaryNumber
      );
    });
  }
}

export const onClerkTranslatorOverviewPage = new ClerkTranslatorOverviewPage();

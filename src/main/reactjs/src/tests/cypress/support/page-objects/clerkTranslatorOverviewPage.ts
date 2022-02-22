import { APIEndpoints } from 'enums/api';
import { AppRoutes } from 'enums/app';
import { ClerkTranslator } from 'interfaces/clerkTranslator';
import { onToast } from 'tests/cypress/support/page-objects/toast';

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
    onToast.expectText('Valittua kääntäjää ei löytynyt');
  }

  expectMode(mode: string) {
    cy.location().should((loc) => {
      expect(loc.search).to.eq(`?mode=${mode}`);
    });
  }

  expectTranslatorDetailsFields(translator: ClerkTranslator) {
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

  expectTranslatorAuthorisationDetails(translator: ClerkTranslator) {
    translator.authorisations.forEach((a) => {
      onClerkTranslatorOverviewPage.expectAuthorisationRowToHaveText(
        a.id,
        a.diaryNumber
      );
    });
  }
}

// Helpers
export const existingTranslator = {
  id: 2,
  version: 0,
  firstName: 'Ilkka',
  lastName: 'Eskola',
  identityNumber: 'id2',
  email: 'translator2@example.invalid',
  phoneNumber: '+358401000002',
  street: 'Sibeliuksenkuja 3',
  postalCode: '06100',
  town: 'Hämeenlinna',
  country: 'SUOMI',
  authorisations: [
    {
      id: 2,
      version: 0,
      languagePair: {
        from: 'SEIN',
        to: 'CS',
      },
      basis: 'AUT',
      diaryNumber: '2',
      autDate: '2022-02-01',
      assuranceDate: '2022-02-01',
      meetingDate: '2021-12-20',
      terms: [
        {
          id: 9,
          version: 0,
          beginDate: '2022-01-01',
          endDate: '2022-01-17',
        },
      ],
      permissionToPublish: true,
    },
    {
      id: 7266,
      version: 0,
      languagePair: {
        from: 'CS',
        to: 'SEIN',
      },
      basis: 'AUT',
      diaryNumber: '7266',
      autDate: '2022-02-01',
      assuranceDate: '2022-02-01',
      meetingDate: '2021-12-20',
      terms: [
        {
          id: 6923,
          version: 0,
          beginDate: '2022-01-01',
          endDate: '2022-01-17',
        },
      ],
      permissionToPublish: true,
    },
  ],
};

export const onClerkTranslatorOverviewPage = new ClerkTranslatorOverviewPage();

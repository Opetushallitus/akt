import { APIEndpoints } from 'enums/api';
import { onClerkHomePage } from 'tests/cypress/support/page-objects/clerkHomePage';
import { onToast } from 'tests/cypress/support/page-objects/toast';

const newTranslatorResponse = {
  id: 4901,
  version: 0,
  firstName: 'Doeline',
  lastName: 'John',
  identityNumber: '010199-1337',
  email: 'john.doeline@tuntematon.fi',
  phoneNumber: '0406667777',
  street: 'Tuntemattomankatu 1',
  postalCode: '99800',
  town: 'Ivalo',
  country: 'Suomi',
  extraInformation: 'Lisätiedot',
  isAssuranceGiven: true,
  authorisations: [
    {
      id: 13428,
      version: 0,
      languagePair: { from: 'FI', to: 'SV' },
      basis: 'KKT',
      termBeginDate: '2022-01-01',
      termEndDate: '2027-01-01',
      permissionToPublish: true,
      diaryNumber: '1337',
    },
  ],
};

beforeEach(() => {
  cy.intercept(APIEndpoints.ClerkTranslator, {
    fixture: 'clerk_translators_10.json',
  });

  cy.intercept('GET', APIEndpoints.MeetingDate, {
    fixture: 'meeting_dates_10.json',
  });

  cy.openClerkHomePage();
});

describe('Add new translator', () => {
  it('should add new translator with authrotisation successfully', () => {
    cy.intercept(
      'POST',
      APIEndpoints.ClerkTranslator,
      newTranslatorResponse
    ).as('createTranslatorResponse');

    onClerkHomePage.clickAddNewTranslatorButton();
    onClerkHomePage.inputNewTranslatorBasicInformationField(
      'lastName',
      'input',
      'Doeline'
    );
    onClerkHomePage.inputNewTranslatorBasicInformationField(
      'firstName',
      'input',
      'John'
    );
    onClerkHomePage.inputNewTranslatorBasicInformationField(
      'identityNumber',
      'input',
      '010199-1337'
    );
    onClerkHomePage.inputNewTranslatorBasicInformationField(
      'street',
      'input',
      'Tuntemattomankatu 1'
    );
    onClerkHomePage.inputNewTranslatorBasicInformationField(
      'postalCode',
      'input',
      '99800'
    );
    onClerkHomePage.inputNewTranslatorBasicInformationField(
      'town',
      'input',
      'Ivalo'
    );
    onClerkHomePage.inputNewTranslatorBasicInformationField(
      'country',
      'input',
      'Suomi'
    );
    onClerkHomePage.inputNewTranslatorBasicInformationField(
      'email',
      'input',
      'john.doeline@tuntematon.fi'
    );
    onClerkHomePage.inputNewTranslatorBasicInformationField(
      'phoneNumber',
      'input',
      '0406667777'
    );
    onClerkHomePage.inputNewTranslatorBasicInformationExtraInformation(
      'Lisätiedot'
    );
    onClerkHomePage.clickNewTranslatorAssuranceToggleButton();

    onClerkHomePage.clickAddAuthorisationButton();

    onClerkHomePage.fillOutAddAuthorisationField('from', 'input', 'suomi');
    onClerkHomePage.fillOutAddAuthorisationField('to', 'input', 'ruotsi');
    onClerkHomePage.fillOutAddAuthorisationField('basis', 'input', 'kkt');
    onClerkHomePage.fillOutAddAuthorisationField(
      'termBeginDate',
      'input',
      '1.1.2022'
    );
    onClerkHomePage.fillOutAddAuthorisationField(
      'diaryNumber',
      'input',
      '1337'
    );

    onClerkHomePage.addAuthorisation();

    onClerkHomePage.expectAuthorisationRowToExist(0);

    onClerkHomePage.clickSaveNewClerkButton();
    cy.wait('@createTranslatorResponse');

    onToast.expectText('Kääntäjän tiedot tallennettiin!');
  });

  it('should not add new translator with missing fields', () => {
    cy.intercept('POST', APIEndpoints.ClerkTranslator, { statusCode: 400 }).as(
      'createTranslatorResponse'
    );

    onClerkHomePage.clickAddNewTranslatorButton();

    onClerkHomePage.inputNewTranslatorBasicInformationField(
      'lastName',
      'input',
      'Doeline'
    );

    onClerkHomePage.clickSaveNewClerkButton();
    cy.wait('@createTranslatorResponse');

    onToast.expectText('Kääntäjän lisääminen ei onnistunut!');
  });
});

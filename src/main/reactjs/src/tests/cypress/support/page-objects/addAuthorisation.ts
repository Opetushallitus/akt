import { AuthorisationBasis } from 'interfaces/authorisation';

class AddAuthorisation {
  elements = {
    root: () => cy.findByTestId('add-authorisation-root'),
    fromLang: () => this.elements.root().findByLabelText('Mistä'),
    toLang: () => this.elements.root().findByLabelText('Mihin'),
    addBtn: () =>
      this.elements.root().findByTestId('add-authorisation__add-btn'),
    basis: () => this.elements.root().findByLabelText('Peruste'),
    beginDate: () =>
      this.elements.root().findByTestId('add-authorisation__term-begin-date'),
    endDate: () =>
      this.elements
        .root()
        .findByTestId('add-authorisation__term-end-date')
        .find('input'),
    diaryNumber: () =>
      this.elements.root().findByTestId('add-authorisation__diary-number'),
    permissionToPublish: () =>
      this.elements
        .root()
        .findByTestId('add-authorisation__permission-to-publish-toggle'),
  };

  selectOptionByName(name: string) {
    cy.findByRole('option', { name }).click();
  }

  selectFromLangByName(from: string) {
    this.elements.fromLang().click();
    this.selectOptionByName(from);
  }

  selectToLangByName(to: string) {
    this.elements.toLang().click();
    this.selectOptionByName(to);
  }

  selectBasis(basis: AuthorisationBasis) {
    this.elements.basis().click();
    this.selectOptionByName(basis);
  }

  selectBeginDate(date: string) {
    this.elements.beginDate().click();
    this.selectOptionByName(date);
  }

  expectEndDate(date: string) {
    this.elements.endDate().should('have.value', date);
  }

  togglePermissionToPublish() {
    this.elements.permissionToPublish().click();
  }

  setDiaryNumber(diaryNumber: string) {
    this.elements.diaryNumber().type(diaryNumber);
  }

  addCurrent() {
    this.elements.addBtn().click();
  }
}

export const onAddAuthorisation = new AddAuthorisation();

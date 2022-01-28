import { selectOption } from 'tests/cypress/support/utils/option';

export const compulsoryLangs = ['suomi', 'ruotsi'];

class PublicTranslatorFilters {
  elements = {
    fromLang: () =>
      cy.findByTestId('public-translator-filters__from-language-select'),
    toLang: () =>
      cy.findByTestId('public-translator-filters__to-language-select'),
    name: () => cy.findByTestId('public-translator-filters__name-field'),
    town: () => cy.findByTestId('public-translator-filters__town-combobox'),
    empty: () => cy.findByTestId('public-translator-filters__empty-btn'),
    search: () => cy.findByTestId('public-translator-filters__search-btn'),
  };

  selectFromLangByName(from: string) {
    this.elements.fromLang().click();
    selectOption(from);
  }

  selectToLangByName(from: string) {
    this.elements.toLang().click();
    selectOption(from);
  }

  filterByLanguagePair(from: string, to: string) {
    this.elements.fromLang().click();
    selectOption(from);

    this.elements.toLang().click();
    selectOption(to);

    this.search();
  }

  filterByName(name: string) {
    this.elements.name().type(name);
    this.search();
  }

  filterByTown(town: string) {
    this.elements.town().click();
    selectOption(town);
    this.search();
  }

  emptySearch() {
    this.elements.empty().click();
  }

  search() {
    this.elements.search().click();
  }

  expectFromLangSelectValues(values: Array<string>) {
    this.elements.fromLang().click();
    cy.findAllByRole('option').should('have.length', values.length);
    values.forEach((value) => cy.findAllByRole('listbox').contains(value));
  }
  expectToLangSelectValues(values: Array<string>) {
    this.elements.toLang().click();
    cy.findAllByRole('option').should('have.length', values.length);
    values.forEach((value) => cy.findAllByRole('listbox').contains(value));
  }
}

export const onPublicTranslatorFilters = new PublicTranslatorFilters();

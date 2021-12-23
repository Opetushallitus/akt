const selectOption = (option: string) => {
  cy.findByRole('option', { name: option }).click();
};

class PublicTranslatorFilters {
  elements = {
    fromLang: () =>
      cy.findByTestId('public-translator-filters__from-language-select'),
    toLang: () =>
      cy.findByTestId('public-translator-filters__to-language-select'),
    name: () => cy.findByTestId('public-translator-filters__name-field'),
    town: () => cy.findByTestId('public-translator-filters__town-select'),
    empty: () => cy.findByTestId('public-translator-filters__empty-btn'),
    search: () => cy.findByTestId('public-translator-filters__search-btn'),
  };

  selectFromLang(lang: string) {
    this.elements.fromLang().click();
    selectOption(lang);
  }

  selectToLang(lang: string) {
    this.elements.toLang().click();
    selectOption(lang);
  }

  selectTown(town: string) {
    this.elements.town().click();
    selectOption(town);
  }

  fillName(name: string) {
    this.elements.name().type(name);
  }

  emptySearch() {
    this.elements.empty().click();
  }

  search() {
    this.elements.search().click();
  }
}

export const onPublicTranslatorFilters = new PublicTranslatorFilters();

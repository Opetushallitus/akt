class PublicTranslatorsListing {
  elements = {
    translatorRow: (id: string) =>
      cy.findByTestId(`public-translators__id-${id}-row`),
    contactRequestBtn: () =>
      cy.findByTestId('public-translators__contact-request-btn'),
  };

  clickTranslatorRow(id: string) {
    this.elements.translatorRow(id).click();
  }

  openContactRequest() {
    this.elements.contactRequestBtn().click();
  }

  expectTranslatorVisible(id: string) {
    cy.findByTestId(`public-translators__id-${id}-row`).should('be.visible');
  }

  expectTranslatorsCount(count: number) {
    cy.findByTestId(`table__head-box__pagination`).should(
      'contain.text',
      `/ ${count}`
    );
  }
}

export const onPublicTranslatorsListing = new PublicTranslatorsListing();

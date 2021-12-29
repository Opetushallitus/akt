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
}

export const onPublicTranslatorsListing = new PublicTranslatorsListing();

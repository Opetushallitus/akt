describe('LangSelector', () => {
  it('should show the Finnish language as a default language', () => {
    cy.visit('/');

    cy.findByTestId('lang-selector').should('contain.text', 'Suomeksi');
  });

  it('should change the language', () => {
    cy.visit('/');

    cy.findByTestId('lang-selector').click();
    cy.findByRole('option', { name: /in english/i }).click();

    cy.findByTestId('lang-selector').should('contain.text', 'In English');
  });
});

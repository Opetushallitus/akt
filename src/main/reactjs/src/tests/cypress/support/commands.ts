Cypress.Commands.add('openPublicHomePage', () => {
  cy.visit('/');
});

Cypress.Commands.add('openClerkHomePage', () => {
  cy.visit('/akt/virkailija');
});

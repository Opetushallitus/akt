export const selectOption = (option: string) => {
  cy.contains(option).then((o: Cypress.Chainable) => {
    o[0].click();
  });
};

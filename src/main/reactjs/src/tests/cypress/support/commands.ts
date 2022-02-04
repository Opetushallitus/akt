import { AppRoutes } from 'enums/app';

Cypress.Commands.add('openPublicHomePage', () => {
  cy.visit(AppRoutes.PublicHomePage);
});

Cypress.Commands.add('openClerkHomePage', () => {
  cy.visit(AppRoutes.ClerkHomePage);
});

Cypress.Commands.add('usePhoneViewport', () => {
  cy.viewport('iphone-6');
});

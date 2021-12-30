import { APIEndpoints } from 'enums/api';

const interceptLanguagesApi = () => {
  const endpoint = APIEndpoints.I18nLanguages;
  const response = { fixture: 'i18n_languages.json' };
  cy.intercept(endpoint, response).as(`intercepted-${endpoint}`);
};

Cypress.Commands.add('openPublicHomePage', () => {
  interceptLanguagesApi();
  cy.visit('/');
});

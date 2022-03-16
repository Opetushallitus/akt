import { onPublicHomePage } from 'tests/cypress/support/page-objects/publicHomePage';

// TODO: fix name and the test
describe('LangSelector', () => {
  it('should show the Finnish language as a default language', () => {
    cy.openPublicHomePage();

    onPublicHomePage.focusSkipLink();

    onPublicHomePage.expectText('Jatka sisältöön');
  });
});

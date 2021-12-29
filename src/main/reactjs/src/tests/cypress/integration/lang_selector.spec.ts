import { onLangSelector } from '../support/page-objects/langSelector';
import { runWithIntercept } from 'tests/cypress/support/utils/api';
import { APIEndpoints } from 'enums/api';

beforeEach(() => {
  runWithIntercept(
    APIEndpoints.I18nLanguages,
    { fixture: 'i18n_languages.json' },
    () => cy.openPublicHomePage()
  );
});

describe('LangSelector', () => {
  it('should show the Finnish language as a default language', () => {
    onLangSelector.elements.langSelector().should('contain.text', 'Suomeksi');
  });

  it('should change the language', () => {
    // act
    onLangSelector.clickLangSelector();
    onLangSelector.selectLangOption('in english');
    // assert
    onLangSelector.elements.langSelector().should('contain.text', 'In English');
  });
});

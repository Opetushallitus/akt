import { onPublicTranslatorFilters } from '../support/page-objects/publicTranslatorFilters';
import { onPublicTranslatorsListing } from '../support/page-objects/publicTranslatorsListing';

beforeEach(() => cy.openPublicHomePage());

describe('PublicTranslatorFilters', () => {
  it('should allow filtering translators by language pair', () => {
    onPublicTranslatorFilters.selectFromLang('suomi');
    onPublicTranslatorFilters.selectToLang('ruotsi');
    onPublicTranslatorFilters.search();

    onPublicTranslatorsListing.expectTranslatorsCount(2450);
  });
});

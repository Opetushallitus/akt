import { onPublicTranslatorFilters } from 'tests/cypress/support/page-objects/publicTranslatorFilters';
import { onPublicTranslatorsListing } from 'tests/cypress/support/page-objects/publicTranslatorsListing';

beforeEach(() => cy.openPublicHomePage());

describe('PublicTranslatorFilters', () => {
  it('should allow filtering results by language pair, name and town', () => {
    onPublicTranslatorFilters.filterByLanguagePair('suomi', 'ruotsi');
    onPublicTranslatorsListing.expectTranslatorsCount(2450);

    onPublicTranslatorFilters.filterByName('mäkinen ii');
    onPublicTranslatorsListing.expectTranslatorsCount(9);

    onPublicTranslatorFilters.filterByTown('Helsinki');
    onPublicTranslatorsListing.expectTranslatorsCount(2);
  });

  it('reset button should clear filters and listed translators', () => {
    onPublicTranslatorFilters.filterByLanguagePair('suomi', 'ruotsi');
    onPublicTranslatorsListing.expectTranslatorsCount(2450);

    onPublicTranslatorFilters.emptySearch();
    onPublicTranslatorsListing.expectEmptyListing();
  });
});

import { APIEndpoints } from 'enums/api';
import { onPublicTranslatorFilters } from 'tests/cypress/support/page-objects/publicTranslatorFilters';
import { onPublicTranslatorsListing } from 'tests/cypress/support/page-objects/publicTranslatorsListing';
import { runWithIntercept } from 'tests/cypress/support/utils/api';

beforeEach(() => {
  runWithIntercept(
    APIEndpoints.PublicTranslator,
    { fixture: 'public_translators_50.json' },
    () => cy.openPublicHomePage()
  );
});

describe('PublicTranslatorFilters', () => {
  it('should allow filtering results by language pair, name and town', () => {
    onPublicTranslatorFilters.filterByLanguagePair('suomi', 'ruotsi');
    onPublicTranslatorsListing.expectTranslatorsCount(27);

    onPublicTranslatorFilters.filterByTown('Helsinki');
    onPublicTranslatorsListing.expectTranslatorsCount(2);

    onPublicTranslatorFilters.filterByName('aaltonen a');
    onPublicTranslatorsListing.expectTranslatorsCount(1);
  });

  it('reset button should clear filters and listed translators', () => {
    onPublicTranslatorFilters.filterByLanguagePair('suomi', 'ruotsi');
    onPublicTranslatorsListing.expectTranslatorsCount(27);

    onPublicTranslatorFilters.emptySearch();
    onPublicTranslatorsListing.expectEmptyListing();
  });
});

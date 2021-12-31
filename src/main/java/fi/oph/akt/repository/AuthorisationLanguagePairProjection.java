package fi.oph.akt.repository;

import fi.oph.akt.model.LanguagePair;

public record AuthorisationLanguagePairProjection(long authorisationId, LanguagePair languagePair) {
}

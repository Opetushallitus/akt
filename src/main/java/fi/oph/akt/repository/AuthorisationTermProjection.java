package fi.oph.akt.repository;

import fi.oph.akt.model.AuthorisationTerm;

public record AuthorisationTermProjection(long authorisationId, AuthorisationTerm term) {
}

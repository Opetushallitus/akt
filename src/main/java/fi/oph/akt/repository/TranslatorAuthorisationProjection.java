package fi.oph.akt.repository;

import fi.oph.akt.model.Authorisation;

public record TranslatorAuthorisationProjection(long translatorId, Authorisation authorisation) {
}

package fi.oph.akt.repository;

import java.time.LocalDate;

public record AuthorisationMeetingDateProjection(long authorisationId, LocalDate date) {}

package fi.oph.akt.repository;

import java.time.LocalDate;

public record MeetingDateProjection(long meetingDateId, LocalDate date) {}

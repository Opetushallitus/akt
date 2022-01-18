package fi.oph.akt.repository;

import fi.oph.akt.model.AuthorisationBasis;
import java.time.LocalDate;

public record AuthorisationProjection(
  long id,
  int version,
  long translatorId,
  LocalDate meetingDate,
  AuthorisationBasis authorisationBasis,
  LocalDate autDate,
  String kktCheck,
  LocalDate virDate,
  LocalDate assuranceDate,
  String fromLang,
  String toLang,
  boolean permissionToPublish
) {}

package fi.oph.akt.repository;

import fi.oph.akt.model.AuthorisationBasis;
import java.time.LocalDate;

public record TranslatorAuthorisationProjection(
  long translatorId,
  long authorisationId,
  int authorisationVersion,
  AuthorisationBasis authorisationBasis,
  LocalDate autDate,
  String kktCheck,
  LocalDate virDate,
  LocalDate assuranceDate,
  String fromLang,
  String toLang,
  boolean permissionToPublish
) {}

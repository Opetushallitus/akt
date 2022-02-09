package fi.oph.akt.api.dto.clerk.modify;

import fi.oph.akt.model.AuthorisationBasis;
import java.time.LocalDate;

public interface AuthorisationDTOCommonFields {
  AuthorisationBasis basis();

  LocalDate autDate();

  String kktCheck();

  LocalDate virDate();

  LocalDate assuranceDate();

  LocalDate meetingDate();

  String from();

  String to();

  Boolean permissionToPublish();

  LocalDate beginDate();

  LocalDate endDate();

  String diaryNumber();
}

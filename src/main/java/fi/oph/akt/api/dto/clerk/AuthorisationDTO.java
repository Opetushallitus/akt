package fi.oph.akt.api.dto.clerk;

import fi.oph.akt.api.dto.LanguagePairDTO;
import fi.oph.akt.model.AuthorisationBasis;
import java.time.LocalDate;
import java.util.List;
import lombok.Builder;
import lombok.NonNull;

public record AuthorisationDTO(
  @NonNull Long id,
  @NonNull Integer version,
  @NonNull LanguagePairDTO languagePair,
  @NonNull AuthorisationBasis basis,
  @NonNull String diaryNumber,
  LocalDate autDate,
  String kktCheck,
  LocalDate virDate,
  LocalDate assuranceDate,
  LocalDate meetingDate,
  List<AuthorisationTermDTO> terms,
  @NonNull Boolean permissionToPublish
) {
  // Workaround for bug in IntelliJ lombok plugin
  // https://github.com/mplushnikov/lombok-intellij-plugin/issues/764
  @Builder
  public AuthorisationDTO {}
}

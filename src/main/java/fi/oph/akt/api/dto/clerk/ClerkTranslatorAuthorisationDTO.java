package fi.oph.akt.api.dto.clerk;

import fi.oph.akt.model.AuthorisationBasis;
import java.time.LocalDate;
import java.util.List;
import lombok.Builder;
import lombok.NonNull;

public record ClerkTranslatorAuthorisationDTO(
  @NonNull Long id,
  @NonNull Integer version,
  @NonNull AuthorisationBasis basis,
  LocalDate autDate,
  String kktCheck,
  LocalDate virDate,
  LocalDate assuranceDate,
  LocalDate meetingDate,
  List<AuthorisationTermDTO> terms,
  @NonNull List<ClerkLanguagePairDTO> languagePairs
) {
  // Workaround for bug in IntelliJ lombok plugin
  // https://github.com/mplushnikov/lombok-intellij-plugin/issues/764
  @Builder
  public ClerkTranslatorAuthorisationDTO {}
}

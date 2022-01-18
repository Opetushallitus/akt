package fi.oph.akt.api.dto.clerk;

import java.util.List;
import lombok.Builder;
import lombok.NonNull;

public record ClerkTranslatorDTO(
  long id,
  @NonNull ClerkTranslatorContactDetailsDTO contactDetails,
  @NonNull List<ClerkTranslatorAuthorisationDTO> authorisations
) {
  // Workaround for bug in IntelliJ lombok plugin
  // https://github.com/mplushnikov/lombok-intellij-plugin/issues/764
  @Builder
  public ClerkTranslatorDTO {}
}

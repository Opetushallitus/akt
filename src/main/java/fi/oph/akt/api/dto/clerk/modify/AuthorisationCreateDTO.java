package fi.oph.akt.api.dto.clerk.modify;

import fi.oph.akt.model.AuthorisationBasis;
import java.time.LocalDate;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.Builder;
import lombok.NonNull;

public record AuthorisationCreateDTO(
  @NonNull @NotNull AuthorisationBasis basis,
  LocalDate autDate,
  String kktCheck,
  LocalDate virDate,
  @NonNull @NotNull LocalDate assuranceDate,
  @NonNull @NotNull LocalDate meetingDate,
  @NonNull @NotBlank String from,
  @NonNull @NotBlank String to,
  @NonNull @NotNull Boolean permissionToPublish,
  @NonNull @NotNull LocalDate beginDate,
  LocalDate endDate,
  @NonNull @NotBlank String diaryNumber
)
  implements AuthorisationDTOCommonFields {
  // Workaround for bug in IntelliJ lombok plugin
  // https://github.com/mplushnikov/lombok-intellij-plugin/issues/764
  @Builder
  public AuthorisationCreateDTO {}
}

package fi.oph.akt.api.dto.clerk.modify;

import fi.oph.akt.model.AuthorisationBasis;
import java.time.LocalDate;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.Builder;
import lombok.NonNull;

public record AuthorisationUpdateDTO(
  @NonNull @NotNull Long id,
  @NonNull @NotNull Integer version,
  @NonNull @NotNull AuthorisationBasis basis,
  @NonNull @NotBlank String from,
  @NonNull @NotBlank String to,
  @NonNull @NotNull LocalDate termBeginDate,
  LocalDate termEndDate,
  @NonNull @NotNull Boolean permissionToPublish,
  @NonNull @NotBlank String diaryNumber,
  @NonNull @NotNull LocalDate meetingDate,
  LocalDate autDate,
  String kktCheck,
  LocalDate virDate,
  @NonNull @NotNull LocalDate assuranceDate
)
  implements AuthorisationDTOCommonFields {
  // Workaround for bug in IntelliJ lombok plugin
  // https://github.com/mplushnikov/lombok-intellij-plugin/issues/764
  @Builder
  public AuthorisationUpdateDTO {}
}

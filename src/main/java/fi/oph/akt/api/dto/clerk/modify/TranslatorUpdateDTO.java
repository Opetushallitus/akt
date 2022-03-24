package fi.oph.akt.api.dto.clerk.modify;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.Builder;

public record TranslatorUpdateDTO(
  @NotNull Long id,
  @NotNull Integer version,
  @NotBlank String firstName,
  @NotBlank String lastName,
  String identityNumber,
  String email,
  String phoneNumber,
  String street,
  String postalCode,
  String town,
  String country,
  String extraInformation,
  @NotNull Boolean isAssuranceGiven
)
  implements TranslatorDTOCommonFields {
  // Workaround for bug in IntelliJ lombok plugin
  // https://github.com/mplushnikov/lombok-intellij-plugin/issues/764
  @Builder
  public TranslatorUpdateDTO {}
}

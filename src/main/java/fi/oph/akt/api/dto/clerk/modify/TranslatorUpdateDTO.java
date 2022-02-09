package fi.oph.akt.api.dto.clerk.modify;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.Builder;
import lombok.NonNull;

public record TranslatorUpdateDTO(
  @NonNull @NotNull Long id,
  @NonNull @NotNull Integer version,
  @NonNull @NotBlank String identityNumber,
  @NonNull @NotBlank String firstName,
  @NonNull @NotBlank String lastName,
  @NonNull @NotBlank @Email String email,
  @NonNull @NotBlank String phoneNumber,
  @NonNull @NotBlank String street,
  @NonNull @NotBlank String town,
  @NonNull @NotBlank String postalCode,
  @NonNull @NotBlank String country
)
  implements TranslatorDTOCommonFields {
  // Workaround for bug in IntelliJ lombok plugin
  // https://github.com/mplushnikov/lombok-intellij-plugin/issues/764
  @Builder
  public TranslatorUpdateDTO {}
}

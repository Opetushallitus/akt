package fi.oph.akt.api.dto.clerk.modify;

import java.util.List;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import lombok.Builder;
import lombok.NonNull;

public record TranslatorCreateDTO(
  @NonNull @NotBlank String firstName,
  @NonNull @NotBlank String lastName,
  String identityNumber,
  @Email String email,
  String phoneNumber,
  String street,
  String postalCode,
  String town,
  String country,
  String extraInformation,
  @NonNull Boolean isAssured,
  @NonNull @NotEmpty List<AuthorisationCreateDTO> authorisations
)
  implements TranslatorDTOCommonFields {
  // Workaround for bug in IntelliJ lombok plugin
  // https://github.com/mplushnikov/lombok-intellij-plugin/issues/764
  @Builder
  public TranslatorCreateDTO {}
}

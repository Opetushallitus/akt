package fi.oph.akt.api.dto.translator;

import java.util.List;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import lombok.Builder;

public record ContactRequestDTO(
  @NotBlank @Size(max = 255) String firstName,
  @NotBlank @Size(max = 255) String lastName,
  @NotBlank @Size(max = 255) String email,
  @Size(max = 255) String phoneNumber,
  @NotBlank @Size(max = 6000) String message,
  @NotBlank @Size(max = 10) String fromLang,
  @NotBlank @Size(max = 10) String toLang,
  @NotEmpty List<Long> translatorIds
) {
  // Workaround for bug in IntelliJ lombok plugin
  // https://github.com/mplushnikov/lombok-intellij-plugin/issues/764
  @Builder
  public ContactRequestDTO {}
}

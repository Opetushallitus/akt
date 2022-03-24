package fi.oph.akt.api.dto.clerk;

import java.util.List;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import lombok.Builder;

public record InformalEmailRequestDTO(
  @NotBlank @Size(max = 255) String subject,
  @NotBlank @Size(max = 6000) String body,
  @NotEmpty List<Long> translatorIds
) {
  @Builder
  public InformalEmailRequestDTO {}
}

package fi.oph.akt.api.dto.clerk;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.util.List;

public record InformalEmailDTO(@NotEmpty @Size(max = 255) String subject, @NotEmpty @Size(max = 6000) String body,
		@NotEmpty List<Long> translatorIds) {
}

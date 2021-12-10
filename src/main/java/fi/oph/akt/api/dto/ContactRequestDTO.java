package fi.oph.akt.api.dto;

import java.util.List;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import lombok.Builder;

public record ContactRequestDTO(@NotEmpty String firstName, @NotEmpty String lastName, @NotEmpty @Email String email,
		String phoneNumber, @NotEmpty String message, @NotEmpty List<Long> translatorIds) {

	// Workaround for bug in IntelliJ lombok plugin
	// https://github.com/mplushnikov/lombok-intellij-plugin/issues/764
	@Builder
	public ContactRequestDTO {
	}
}

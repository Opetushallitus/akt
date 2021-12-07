package fi.oph.akt.api.dto;

import java.util.List;
import lombok.Builder;
import lombok.NonNull;

public record ClerkTranslatorDTO(@NonNull long id, String oid, @NonNull String firstName, @NonNull String lastName,
		String email, String phone, String mobilePhone, String street, String postalCode, String town, String country,
		@NonNull List<ClerkLanguagePairDTO> languagePairs) {

	// Workaround for bug in IntelliJ lombok plugin
	// https://github.com/mplushnikov/lombok-intellij-plugin/issues/764
	@Builder
	public ClerkTranslatorDTO {
	}
}

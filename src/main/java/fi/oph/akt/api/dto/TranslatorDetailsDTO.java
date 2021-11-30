package fi.oph.akt.api.dto;

import lombok.Builder;

public record TranslatorDetailsDTO(String nickname, String firstNames, String surname, String email, String phone,
		String mobilePhone, String street, String postalCode, String town, String country) {

	// Workaround for bug in IntelliJ lombok plugin
	// https://github.com/mplushnikov/lombok-intellij-plugin/issues/764
	@Builder
	public TranslatorDetailsDTO {
	}
}

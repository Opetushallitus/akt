package fi.oph.akt.api.dto;

import java.time.LocalDate;
import lombok.Builder;

public record TranslatorDetailsDTO(String nickname, String firstNames, String surname, String email, String phone,
		String mobilePhone, String street, String postalCode, String town, String country, LocalDate birthDate,
		String identityNumber, String nativeLanguage) {

	// Workaround for bug in IntelliJ lombok plugin
	// https://github.com/mplushnikov/lombok-intellij-plugin/issues/764
	@Builder
	public TranslatorDetailsDTO {
	}
}

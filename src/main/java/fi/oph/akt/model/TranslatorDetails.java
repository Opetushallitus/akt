package fi.oph.akt.model;

import lombok.Builder;

import java.time.LocalDate;

public record TranslatorDetails(String nickname, String firstNames, String surname, String email, String phone,
		String mobilePhone, String street, String postalCode, String town, String country, LocalDate birthDate,
		String identityNumber, String nativeLanguage) {

	@Builder
	public TranslatorDetails {
	}
}

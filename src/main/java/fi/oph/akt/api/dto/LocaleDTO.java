package fi.oph.akt.api.dto;

import com.fasterxml.jackson.annotation.JsonValue;

public enum LocaleDTO {

	FI("fi-FI"), SV("sv-SE"), EN("en-GB");

	private final String value;

	LocaleDTO(final String value) {
		this.value = value;
	}

	@JsonValue
	public String getValue() {
		return value;
	}

}

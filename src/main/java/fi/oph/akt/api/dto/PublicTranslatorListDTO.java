package fi.oph.akt.api.dto;

import lombok.Builder;
import lombok.NonNull;

import java.util.List;

public record PublicTranslatorListDTO(@NonNull List<PublicTranslatorDTO> translators,
		@NonNull LanguagePairListDTO langs, @NonNull List<String> towns) {

	// Workaround for bug in IntelliJ lombok plugin
	// https://github.com/mplushnikov/lombok-intellij-plugin/issues/764
	@Builder
	public PublicTranslatorListDTO {
	}
}

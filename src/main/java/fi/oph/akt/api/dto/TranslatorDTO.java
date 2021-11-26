package fi.oph.akt.api.dto;

import java.util.List;
import lombok.Builder;
import lombok.NonNull;

public record TranslatorDTO(long id, @NonNull String oid, @NonNull TranslatorDetailsDTO details,
		@NonNull List<LanguagePairDTO> languagePairs) {

	// Workaround for bug in IntelliJ lombok plugin
	// https://github.com/mplushnikov/lombok-intellij-plugin/issues/764
	@Builder
	public TranslatorDTO {
	}
}

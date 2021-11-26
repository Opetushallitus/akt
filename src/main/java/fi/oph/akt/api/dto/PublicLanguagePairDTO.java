package fi.oph.akt.api.dto;

import lombok.Builder;
import lombok.NonNull;

public record PublicLanguagePairDTO(@NonNull String fromLang, @NonNull String toLang) {
	// Workaround for bug in IntelliJ lombok plugin
	// https://github.com/mplushnikov/lombok-intellij-plugin/issues/764
	@Builder
	public PublicLanguagePairDTO {
	}
}

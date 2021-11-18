package fi.oph.akt.api.search;

import lombok.Builder;
import lombok.NonNull;

public record LanguagePairDTO(@NonNull String fromLang, @NonNull String toLang) {
	// Workaround for bug in IntelliJ lombok plugin
	// https://github.com/mplushnikov/lombok-intellij-plugin/issues/764
	@Builder
	public LanguagePairDTO {
	}
}
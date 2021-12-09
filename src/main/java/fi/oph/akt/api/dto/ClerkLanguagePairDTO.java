package fi.oph.akt.api.dto;

import lombok.Builder;
import lombok.NonNull;

public record ClerkLanguagePairDTO(@NonNull String from, @NonNull String to, @NonNull boolean permissionToPublish) {
	// Workaround for bug in IntelliJ lombok plugin
	// https://github.com/mplushnikov/lombok-intellij-plugin/issues/764
	@Builder
	public ClerkLanguagePairDTO {
	}
}
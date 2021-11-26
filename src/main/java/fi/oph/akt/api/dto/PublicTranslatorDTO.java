package fi.oph.akt.api.dto;

import java.util.List;
import lombok.Builder;
import lombok.NonNull;

public record PublicTranslatorDTO(long id, @NonNull String firstName, @NonNull String lastName,
		@NonNull List<PublicLanguagePairDTO> languagePairs) {

	@Builder
	public PublicTranslatorDTO {
	}
}

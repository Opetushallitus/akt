package fi.oph.akt.api.dto;

import java.util.List;

import fi.oph.akt.model.TranslatorDetails;
import lombok.Builder;
import lombok.NonNull;

public record TranslatorDTO(long id, @NonNull String oid, @NonNull TranslatorDetails details,
		@NonNull List<LanguagePairDTO> languagePairs) {

	@Builder
	public TranslatorDTO {
	}
}

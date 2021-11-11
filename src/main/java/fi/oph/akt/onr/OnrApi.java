package fi.oph.akt.onr;

import fi.oph.akt.model.TranslatorDetails;
import fi.oph.akt.onr.model.HenkiloDto;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

abstract class OnrApi {

	@Resource
	private TranslatorDetailsFactory translatorDetailsFactory;

	public Map<String, TranslatorDetails> getTranslatorDetailsByOids(List<String> oids) {
		List<HenkiloDto> henkiloDtos = getHenkiloDtos(oids);

		Map<String, TranslatorDetails> details = new HashMap<>();

		henkiloDtos.forEach(h -> details.put(h.getOidHenkilo(), translatorDetailsFactory.createByHenkiloDto(h)));
		return details;
	}

	abstract List<HenkiloDto> getHenkiloDtos(List<String> oids);

}

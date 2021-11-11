package fi.oph.akt.onr.model.yhteystieto;

import fi.oph.akt.onr.model.HenkiloDto;
import org.springframework.stereotype.Service;

import java.util.stream.Stream;

import static java.util.Comparator.comparing;

@Service
public class YhteystietoUtil {

	private Stream<YhteystietoDto> getYhteystietoStream(HenkiloDto henkilo, YhteystietoType yhteystietoTyyppi) {
		return henkilo.getYhteystiedotRyhma().stream().sorted(comparing(YhteystiedotRyhmaDto::getRyhmaKuvaus))
				.flatMap(ytr -> ytr.getYhteystieto().stream())
				.filter(yt -> yt.getYhteystietoTyyppi() == yhteystietoTyyppi)
				.filter(yt -> yt.getYhteystietoArvo() != null && !yt.getYhteystietoArvo().isEmpty());
	}

	public String getValue(HenkiloDto henkilo, YhteystietoType yhteystietoTyyppi) {
		return getYhteystietoStream(henkilo, yhteystietoTyyppi).map(YhteystietoDto::getYhteystietoArvo).findFirst()
				.orElse(null);
	}

}

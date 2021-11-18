package fi.oph.akt.onr;

import fi.oph.akt.model.TranslatorDetails;
import fi.oph.akt.onr.model.HenkiloDto;
import fi.oph.akt.onr.model.yhteystieto.YhteystiedotRyhmaDto;
import fi.oph.akt.onr.model.yhteystieto.YhteystietoDto;
import fi.oph.akt.onr.model.yhteystieto.YhteystietoType;

import static java.util.Comparator.comparing;

public class TranslatorDetailsFactory {

	public static TranslatorDetails createByHenkiloDto(HenkiloDto henkilo) {
		return TranslatorDetails.builder().nickname(henkilo.getKutsumanimi()).firstNames(henkilo.getEtunimet())
				.surname(henkilo.getSukunimi()).email(getValue(henkilo, YhteystietoType.YHTEYSTIETO_SAHKOPOSTI))
				.phone(getValue(henkilo, YhteystietoType.YHTEYSTIETO_PUHELINNUMERO))
				.mobilePhone(getValue(henkilo, YhteystietoType.YHTEYSTIETO_MATKAPUHELINNUMERO))
				.street(getValue(henkilo, YhteystietoType.YHTEYSTIETO_KATUOSOITE))
				.postalCode(getValue(henkilo, YhteystietoType.YHTEYSTIETO_POSTINUMERO))
				.town(getValue(henkilo, YhteystietoType.YHTEYSTIETO_KAUPUNKI))
				.country(getValue(henkilo, YhteystietoType.YHTEYSTIETO_MAA)).birthDate(henkilo.getSyntymaaika())
				.identityNumber(henkilo.getHetu()).nativeLanguage(henkilo.getAidinkieli().getKieliTyyppi()).build();
	}

	private static String getValue(HenkiloDto henkiloDto, YhteystietoType yhteystietoTyyppi) {
		return henkiloDto.getYhteystiedotRyhma().stream().sorted(comparing(YhteystiedotRyhmaDto::getRyhmaKuvaus))
				.flatMap(ytr -> ytr.getYhteystieto().stream())
				.filter(yt -> yt.getYhteystietoTyyppi() == yhteystietoTyyppi)
				.filter(yt -> yt.getYhteystietoArvo() != null && !yt.getYhteystietoArvo().isEmpty())
				.map(YhteystietoDto::getYhteystietoArvo).findFirst().orElse(null);
	}

}

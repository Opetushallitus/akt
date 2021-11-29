package fi.oph.akt.onr;

import fi.oph.akt.model.TranslatorDetails;
import fi.oph.akt.onr.model.HenkiloDto;
import fi.oph.akt.onr.model.yhteystieto.YhteystiedotRyhmaDto;
import fi.oph.akt.onr.model.yhteystieto.YhteystiedotRyhmakuvausType;
import fi.oph.akt.onr.model.yhteystieto.YhteystietoDto;
import fi.oph.akt.onr.model.yhteystieto.YhteystietoType;
import fi.oph.akt.util.CustomOrderComparator;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Comparator.*;

public class TranslatorDetailsFactory {

	private static final String aktSource = "alkupera8";

	private static final Comparator<String> ytrComparator = new CustomOrderComparator<>(
			YhteystiedotRyhmakuvausType.prioritisedOrdering);

	public static TranslatorDetails createByHenkiloDto(HenkiloDto henkilo) {
		// @formatter:off
		List<YhteystiedotRyhmaDto> ytrs = getOrderedYtrList(henkilo);

		return TranslatorDetails.builder()
				.nickname(henkilo.getKutsumanimi())
				.firstNames(henkilo.getEtunimet())
				.surname(henkilo.getSukunimi())
				.email(getValue(ytrs, YhteystietoType.YHTEYSTIETO_SAHKOPOSTI))
				.phone(getValue(ytrs, YhteystietoType.YHTEYSTIETO_PUHELINNUMERO))
				.mobilePhone(getValue(ytrs, YhteystietoType.YHTEYSTIETO_MATKAPUHELINNUMERO))
				.street(getValue(ytrs, YhteystietoType.YHTEYSTIETO_KATUOSOITE))
				.postalCode(getValue(ytrs, YhteystietoType.YHTEYSTIETO_POSTINUMERO))
				.town(getValue(ytrs, YhteystietoType.YHTEYSTIETO_KAUPUNKI))
				.country(getValue(ytrs, YhteystietoType.YHTEYSTIETO_MAA))
				.birthDate(henkilo.getSyntymaaika())
				.identityNumber(henkilo.getHetu()).build();
		// @formatter:on
	}

	private static List<YhteystiedotRyhmaDto> getOrderedYtrList(HenkiloDto henkiloDto) {
		// @formatter:off
		List<YhteystiedotRyhmaDto> aktYtrs = henkiloDto
				.getYhteystiedotRyhma()
				.stream()
				.filter(ytr -> ytr.getRyhmaAlkuperaTieto().equals(aktSource))
				.collect(Collectors.toList()); // mutable list

		List<YhteystiedotRyhmaDto> otherYtrs = henkiloDto
				.getYhteystiedotRyhma()
				.stream()
				.sorted(comparing(YhteystiedotRyhmaDto::getRyhmaKuvaus, nullsLast(ytrComparator.thenComparing(naturalOrder()))))
				.filter(ytr -> !ytr.getRyhmaKuvaus().equals(YhteystiedotRyhmakuvausType.KOTIOSOITE_TYYPPI))
				.toList();

		aktYtrs.addAll(otherYtrs);
		return aktYtrs;
		// @formatter:on
	}

	private static String getValue(List<YhteystiedotRyhmaDto> orderedYtrs, YhteystietoType yhteystietoType) {
		// @formatter:off
		return orderedYtrs
				.stream()
				.flatMap(ytr -> ytr.getYhteystieto().stream())
				.filter(yt -> yt.getYhteystietoTyyppi() == yhteystietoType)
				.filter(yt -> yt.getYhteystietoArvo() != null && !yt.getYhteystietoArvo().isEmpty())
				.map(YhteystietoDto::getYhteystietoArvo)
				.findFirst()
				.orElse(null);
		// @formatter:on
	}

}

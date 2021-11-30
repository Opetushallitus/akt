package fi.oph.akt.onr;

import fi.oph.akt.model.TranslatorDetails;
import fi.oph.akt.onr.model.HenkiloDto;
import fi.oph.akt.onr.model.contactDetails.*;
import fi.oph.akt.util.CustomOrderComparator;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Comparator.*;

public class TranslatorDetailsFactory {

	private static final Comparator<String> groupsComparator = new CustomOrderComparator<>(
			ContactDetailsGroupType.prioritisedOrdering);

	public static TranslatorDetails createByHenkiloDto(HenkiloDto henkilo) {
		// @formatter:off
		List<ContactDetailsGroupDto> groups = getOrderedContactDetailsGroups(henkilo);

		return TranslatorDetails.builder()
				.nickname(henkilo.getKutsumanimi())
				.firstNames(henkilo.getEtunimet())
				.surname(henkilo.getSukunimi())
				.email(getValue(groups, YhteystietoTyyppi.YHTEYSTIETO_SAHKOPOSTI))
				.phone(getValue(groups, YhteystietoTyyppi.YHTEYSTIETO_PUHELINNUMERO))
				.mobilePhone(getValue(groups, YhteystietoTyyppi.YHTEYSTIETO_MATKAPUHELINNUMERO))
				.street(getValue(groups, YhteystietoTyyppi.YHTEYSTIETO_KATUOSOITE))
				.postalCode(getValue(groups, YhteystietoTyyppi.YHTEYSTIETO_POSTINUMERO))
				.town(getValue(groups, YhteystietoTyyppi.YHTEYSTIETO_KAUPUNKI))
				.country(getValue(groups, YhteystietoTyyppi.YHTEYSTIETO_MAA))
				.birthDate(henkilo.getSyntymaaika())
				.identityNumber(henkilo.getHetu())
				.build();
		// @formatter:on
	}

	private static List<ContactDetailsGroupDto> getOrderedContactDetailsGroups(HenkiloDto henkiloDto) {
		// @formatter:off
		List<ContactDetailsGroupDto> aktGroups = henkiloDto
				.getYhteystiedotRyhma()
				.stream()
				.filter(group -> group.getSource().equals(ContactDetailsGroupSource.AKT))
				.collect(Collectors.toList()); // mutable list

		List<ContactDetailsGroupDto> otherGroups = henkiloDto
				.getYhteystiedotRyhma()
				.stream()
				.sorted(comparing(ContactDetailsGroupDto::getType, nullsLast(groupsComparator.thenComparing(naturalOrder()))))
				.filter(group -> !group.getType().equals(ContactDetailsGroupType.HOME_ADDRESS))
				.toList();

		aktGroups.addAll(otherGroups);
		return aktGroups;
		// @formatter:on
	}

	private static String getValue(List<ContactDetailsGroupDto> contactDetailsGroups,
			YhteystietoTyyppi yhteystietoTyyppi) {
		// @formatter:off
		return contactDetailsGroups
				.stream()
				.flatMap(group -> group.getDetailsSet().stream())
				.filter(details -> details.getYhteystietoTyyppi() == yhteystietoTyyppi)
				.filter(details -> details.getValue() != null && !details.getValue().isEmpty())
				.map(ContactDetailsDto::getValue)
				.findFirst()
				.orElse(null);
		// @formatter:on
	}

}

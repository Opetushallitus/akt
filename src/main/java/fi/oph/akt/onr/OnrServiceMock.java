package fi.oph.akt.onr;

import fi.oph.akt.onr.model.HenkiloDto;
import fi.oph.akt.onr.model.contactDetails.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import java.util.Set;

@Service
public class OnrServiceMock extends OnrApi {

	@Override
	public List<HenkiloDto> getHenkiloDtos(List<String> oids) {
		return oids.stream().map(HenkiloDtoFactory::createHenkiloDto).toList();
	}

}

class HenkiloDtoFactory {

	private static final String[] menFirstNames = { "Antti", "Eero", "Ilkka", "Jari", "Juha", "Matti", "Pekka",
			"Timo" };

	private static final String[] menSecondNames = { "Iiro", "Jukka", "Kalle", "Kari", "Marko", "Mikko", "Tapani",
			"Ville" };

	private static final String[] womenFirstNames = { "Anneli", "Ella", "Hanna", "Iiris", "Liisa", "Maria", "Ninni",
			"Viivi" };

	private static final String[] womenSecondNames = { "Anna", "Iida", "Kerttu", "Kristiina", "Marjatta", "Ronja",
			"Sara" };

	private static final String[] surnames = { "Aaltonen", "Alanen", "Eskola", "Hakala", "Heikkinen", "Heinonen",
			"Hiltunen", "Hirvonen", "Hämäläinen", "Kallio", "Karjalainen", "Kinnunen", "Korhonen", "Koskinen", "Laakso",
			"Lahtinen", "Laine", "Lehtonen", "Leinonen", "Leppänen", "Manninen", "Mattila", "Mäkinen", "Nieminen",
			"Noronen", "Ojala", "Paavola", "Pitkänen", "Räsänen", "Saarinen", "Salo", "Salonen", "Toivonen", "Tuominen",
			"Turunen", "Valtonen", "Virtanen", "Väisänen" };

	private static final String[] identityNumbers = { "060105A910A", "260875-9507", "040352-904K", "130208A919P",
			"240636-9187", "080716A957T", "120137-9646", "180720A968M", "020713A978U", "130730-960R", "151084-927A",
			"240714A9723", "290338-944C", "280554-9389" };

	private static final String[] streets = { "Malminkatu 1", "Runebergintie 2", "Sibeliuksenkuja 3", "Veturitie 4",
			"Pirkkolantie 123" };

	private static final String[] postalCodes = { "00100", "01200", "06100", "13500", "31600", "48600", "54460" };

	private static final String[] towns = { "Helsinki", "Turku", "Hämeenlinna", "Kuopio", "Lahti", "Porvoo", "Vantaa" };

	public static HenkiloDto createHenkiloDto(String oid) {
		Random rand = new Random();
		String nickname;
		String secondName;

		if (rand.nextBoolean()) {
			nickname = menFirstNames[rand.nextInt(menFirstNames.length)];
			secondName = menSecondNames[rand.nextInt(menSecondNames.length)];
		}
		else {
			nickname = womenFirstNames[rand.nextInt(womenFirstNames.length)];
			secondName = womenSecondNames[rand.nextInt(womenSecondNames.length)];
		}

		//@formatter:off
		HenkiloDto henkiloDto = HenkiloDto.builder()
				.oidHenkilo(oid)
				.hetu(identityNumbers[rand.nextInt(identityNumbers.length)])
				.etunimet(nickname + " " + secondName)
				.kutsumanimi(nickname)
				.sukunimi(surnames[rand.nextInt(surnames.length)])
				.build();
		//@formatter:on

		henkiloDto.setSyntymaaika(getBirthDateByIdentityNumber(henkiloDto.getHetu()));

		henkiloDto
				.setYhteystiedotRyhma(Set.of(createAktContactDetails(henkiloDto, rand), createVtjContactDetails(rand)));

		return henkiloDto;
	}

	private static ContactDetailsGroupDto createAktContactDetails(HenkiloDto henkiloDto, Random rand) {
		ContactDetailsGroupDto detailsGroup = new ContactDetailsGroupDto();

		String email = henkiloDto.getKutsumanimi().toLowerCase() + "." + henkiloDto.getSukunimi().toLowerCase()
				+ "@akt.fi";
		String phone = "+35840" + (1000000 + rand.nextInt(9000000));

		Set<ContactDetailsDto> detailsSet = Set.of(
				new ContactDetailsDto(YhteystietoTyyppi.YHTEYSTIETO_SAHKOPOSTI, email),
				new ContactDetailsDto(YhteystietoTyyppi.YHTEYSTIETO_PUHELINNUMERO, phone));

		detailsGroup.setType(ContactDetailsGroupType.CONTACT_DETAILS_FILLED_FOR_APPLICATION);
		detailsGroup.setSource(ContactDetailsGroupSource.AKT);
		detailsGroup.setDetailsSet(detailsSet);

		return detailsGroup;
	}

	private static ContactDetailsGroupDto createVtjContactDetails(Random rand) {
		ContactDetailsGroupDto detailsGroup = new ContactDetailsGroupDto();

		Set<ContactDetailsDto> detailsSet = Set.of(
				new ContactDetailsDto(YhteystietoTyyppi.YHTEYSTIETO_KATUOSOITE, streets[rand.nextInt(streets.length)]),
				new ContactDetailsDto(YhteystietoTyyppi.YHTEYSTIETO_POSTINUMERO,
						postalCodes[rand.nextInt(postalCodes.length)]),
				new ContactDetailsDto(YhteystietoTyyppi.YHTEYSTIETO_KAUPUNKI, towns[rand.nextInt(towns.length)]),
				new ContactDetailsDto(YhteystietoTyyppi.YHTEYSTIETO_MAA, "Suomi"));

		detailsGroup.setType(ContactDetailsGroupType.VTJ_REGULAR_DOMESTIC_ADDRESS);
		detailsGroup.setSource(ContactDetailsGroupSource.VTJ);
		detailsGroup.setDetailsSet(detailsSet);

		return detailsGroup;
	}

	private static LocalDate getBirthDateByIdentityNumber(String identityNumber) {
		LocalDate date = LocalDate.parse(identityNumber.substring(0, 6), DateTimeFormatter.ofPattern("ddMMyy"));

		return identityNumber.charAt(6) == '-' ? date.minusYears(100) : date;
	}

}

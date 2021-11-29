package fi.oph.akt.onr;

import fi.oph.akt.onr.model.HenkiloDto;
import fi.oph.akt.onr.model.KielisyysDto;
import fi.oph.akt.onr.model.yhteystieto.YhteystiedotRyhmaDto;
import fi.oph.akt.onr.model.yhteystieto.YhteystiedotRyhmakuvausType;
import fi.oph.akt.onr.model.yhteystieto.YhteystietoDto;
import fi.oph.akt.onr.model.yhteystieto.YhteystietoType;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
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

	private static final String[] streets = { "Malminkatu", "Runebergintie", "Sibeliuksenkuja", "Veturitie",
			"Pirkkolantie" };

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

		HenkiloDto henkiloDto = HenkiloDto.builder().oidHenkilo(oid)
				.hetu(identityNumbers[rand.nextInt(identityNumbers.length)]).etunimet(nickname + " " + secondName)
				.kutsumanimi(nickname).sukunimi(surnames[rand.nextInt(surnames.length)])
				.aidinkieli(new KielisyysDto("fi", "suomi")).build();

		henkiloDto.setSyntymaaika(getBirthDateByIdentityNumber(henkiloDto.getHetu()));

		Set<YhteystietoDto> yhteystiedot = new HashSet<>();
		yhteystiedot
				.add(new YhteystietoDto(YhteystietoType.YHTEYSTIETO_KATUOSOITE, streets[rand.nextInt(streets.length)]));
		yhteystiedot.add(new YhteystietoDto(YhteystietoType.YHTEYSTIETO_POSTINUMERO,
				postalCodes[rand.nextInt(postalCodes.length)]));
		yhteystiedot.add(new YhteystietoDto(YhteystietoType.YHTEYSTIETO_KAUPUNKI, towns[rand.nextInt(towns.length)]));
		yhteystiedot.add(new YhteystietoDto(YhteystietoType.YHTEYSTIETO_MAA, "Suomi"));
		yhteystiedot.add(new YhteystietoDto(YhteystietoType.YHTEYSTIETO_SAHKOPOSTI,
				henkiloDto.getKutsumanimi() + "." + henkiloDto.getSukunimi() + "@test.fi"));
		yhteystiedot.add(new YhteystietoDto(YhteystietoType.YHTEYSTIETO_PUHELINNUMERO,
				"+35840" + (1000000 + rand.nextInt(9000000))));

		YhteystiedotRyhmaDto yhteystiedotRyhma = new YhteystiedotRyhmaDto();
		yhteystiedotRyhma.setYhteystieto(yhteystiedot);
		yhteystiedotRyhma.setRyhmaAlkuperaTieto("alkupera1");
		yhteystiedotRyhma.setRyhmaKuvaus(YhteystiedotRyhmakuvausType.VAKINAINEN_KOTIMAAN_OSOITE_TYYPPI);

		henkiloDto.setYhteystiedotRyhma(new HashSet<>());
		henkiloDto.getYhteystiedotRyhma().add(yhteystiedotRyhma);

		return henkiloDto;
	}

	private static LocalDate getBirthDateByIdentityNumber(String identityNumber) {
		LocalDate date = LocalDate.parse(identityNumber.substring(0, 6), DateTimeFormatter.ofPattern("ddMMyy"));

		return identityNumber.charAt(6) == '-' ? date.minusYears(100) : date;
	}

}

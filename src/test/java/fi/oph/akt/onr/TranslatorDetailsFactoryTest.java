package fi.oph.akt.onr;

import fi.oph.akt.model.TranslatorDetails;
import fi.oph.akt.onr.model.HenkiloDto;
import fi.oph.akt.onr.model.contactDetails.*;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTest
public class TranslatorDetailsFactoryTest {

	@Test
	public void createByHenkiloDtoShouldReturnTranslatorDetails() {
		HenkiloDto henkiloDto = createBasicHenkiloDto();

		henkiloDto.setYhteystiedotRyhma(new HashSet<>());
		henkiloDto.getYhteystiedotRyhma().add(createVtjContactDetails());

		TranslatorDetails details = TranslatorDetailsFactory.createByHenkiloDto(henkiloDto);

		assertEquals("Anna", details.nickname());
		assertEquals("Anna Maija", details.firstNames());
		assertEquals("Mattila", details.surname());
		assertEquals("anna.mattila@test.fi", details.email());
		assertEquals("+358401234567", details.phone());
		assertEquals("+358402345678", details.mobilePhone());
		assertEquals("Testitie 1", details.street());
		assertEquals("00100", details.postalCode());
		assertEquals("Helsinki", details.town());
		assertEquals("Suomi", details.country());
		assertEquals(LocalDate.parse("1983-01-27"), details.birthDate());
		assertEquals("270183-994P", details.identityNumber());
	}

	@Test
	public void createByHenkiloDtoShouldPrioritiseAktContactDetails() {
		HenkiloDto henkiloDto = createBasicHenkiloDto();

		henkiloDto.setYhteystiedotRyhma(new HashSet<>());
		henkiloDto.getYhteystiedotRyhma().add(createVtjContactDetails());
		henkiloDto.getYhteystiedotRyhma().add(createAktContactDetails());

		TranslatorDetails details = TranslatorDetailsFactory.createByHenkiloDto(henkiloDto);

		assertEquals("Anna", details.nickname());
		assertEquals("Anna Maija", details.firstNames());
		assertEquals("Mattila", details.surname());
		assertEquals("anna.mattila@akt.fi", details.email());
		assertEquals("+358401122334", details.phone());
		assertEquals("+358402345678", details.mobilePhone());
		assertEquals("Kääntäjäntie 2", details.street());
		assertEquals("00100", details.postalCode());
		assertEquals("Helsinki", details.town());
		assertEquals("Suomi", details.country());
		assertEquals(LocalDate.parse("1983-01-27"), details.birthDate());
		assertEquals("270183-994P", details.identityNumber());
	}

	private HenkiloDto createBasicHenkiloDto() {
		//@formatter:off
		return HenkiloDto.builder()
				.etunimet("Anna Maija")
				.kutsumanimi("Anna")
				.sukunimi("Mattila")
				.syntymaaika(LocalDate.parse("1983-01-27"))
				.hetu("270183-994P")
				.build();
		//@formatter:on
	}

	private ContactDetailsGroupDto createVtjContactDetails() {
		ContactDetailsGroupDto contactDetailsGroup = new ContactDetailsGroupDto();
		Set<ContactDetailsDto> contactDetailsSet = new HashSet<>();

		contactDetailsSet.add(new ContactDetailsDto(YhteystietoTyyppi.YHTEYSTIETO_SAHKOPOSTI, "anna.mattila@test.fi"));
		contactDetailsSet.add(new ContactDetailsDto(YhteystietoTyyppi.YHTEYSTIETO_PUHELINNUMERO, "+358401234567"));
		contactDetailsSet.add(new ContactDetailsDto(YhteystietoTyyppi.YHTEYSTIETO_MATKAPUHELINNUMERO, "+358402345678"));
		contactDetailsSet.add(new ContactDetailsDto(YhteystietoTyyppi.YHTEYSTIETO_KATUOSOITE, "Testitie 1"));
		contactDetailsSet.add(new ContactDetailsDto(YhteystietoTyyppi.YHTEYSTIETO_POSTINUMERO, "00100"));
		contactDetailsSet.add(new ContactDetailsDto(YhteystietoTyyppi.YHTEYSTIETO_KAUPUNKI, "Helsinki"));
		contactDetailsSet.add(new ContactDetailsDto(YhteystietoTyyppi.YHTEYSTIETO_MAA, "Suomi"));

		contactDetailsGroup.setType(ContactDetailsGroupType.VTJ_REGULAR_DOMESTIC_ADDRESS);
		contactDetailsGroup.setSource(ContactDetailsGroupSource.VTJ);
		contactDetailsGroup.setDetailsSet(contactDetailsSet);

		return contactDetailsGroup;
	}

	private ContactDetailsGroupDto createAktContactDetails() {
		ContactDetailsGroupDto contactDetailsGroup = new ContactDetailsGroupDto();
		Set<ContactDetailsDto> contactDetailsSet = new HashSet<>();

		contactDetailsSet.add(new ContactDetailsDto(YhteystietoTyyppi.YHTEYSTIETO_SAHKOPOSTI, "anna.mattila@akt.fi"));
		contactDetailsSet.add(new ContactDetailsDto(YhteystietoTyyppi.YHTEYSTIETO_PUHELINNUMERO, "+358401122334"));
		contactDetailsSet.add(new ContactDetailsDto(YhteystietoTyyppi.YHTEYSTIETO_KATUOSOITE, "Kääntäjäntie 2"));

		contactDetailsGroup.setType(ContactDetailsGroupType.APPLICATION_ADDRESS);
		contactDetailsGroup.setSource(ContactDetailsGroupSource.AKT);
		contactDetailsGroup.setDetailsSet(contactDetailsSet);

		return contactDetailsGroup;
	}

}

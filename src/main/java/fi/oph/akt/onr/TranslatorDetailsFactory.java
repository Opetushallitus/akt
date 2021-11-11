package fi.oph.akt.onr;

import fi.oph.akt.model.TranslatorDetails;
import fi.oph.akt.onr.model.HenkiloDto;
import fi.oph.akt.onr.model.yhteystieto.YhteystietoType;
import fi.oph.akt.onr.model.yhteystieto.YhteystietoUtil;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
public class TranslatorDetailsFactory {

	@Resource
	private YhteystietoUtil util;

	public TranslatorDetails createByHenkiloDto(HenkiloDto henkilo) {
		return TranslatorDetails.builder().nickname(henkilo.getKutsumanimi()).firstNames(henkilo.getEtunimet())
				.surname(henkilo.getSukunimi()).email(util.getValue(henkilo, YhteystietoType.YHTEYSTIETO_SAHKOPOSTI))
				.phone(util.getValue(henkilo, YhteystietoType.YHTEYSTIETO_PUHELINNUMERO))
				.mobilePhone(util.getValue(henkilo, YhteystietoType.YHTEYSTIETO_MATKAPUHELINNUMERO))
				.street(util.getValue(henkilo, YhteystietoType.YHTEYSTIETO_KATUOSOITE))
				.postalCode(util.getValue(henkilo, YhteystietoType.YHTEYSTIETO_POSTINUMERO))
				.town(util.getValue(henkilo, YhteystietoType.YHTEYSTIETO_KAUPUNKI))
				.country(util.getValue(henkilo, YhteystietoType.YHTEYSTIETO_MAA)).birthDate(henkilo.getSyntymaaika())
				.identityNumber(henkilo.getHetu()).nativeLanguage(henkilo.getAidinkieli().getKieliTyyppi()).build();
	}

}

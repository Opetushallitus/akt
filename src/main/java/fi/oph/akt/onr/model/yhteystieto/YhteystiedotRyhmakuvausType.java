package fi.oph.akt.onr.model.yhteystieto;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class YhteystiedotRyhmakuvausType {

	public static final String KOTIOSOITE_TYYPPI = "yhteystietotyyppi1";

	public static final String VAKINAINEN_KOTIMAAN_OSOITE_TYYPPI = "yhteystietotyyppi4";

	public static final String VAKINAINEN_ULKOMAAN_OSOITE_TYYPPI = "yhteystietotyyppi5";

	public static final String SAHKOINEN_OSOITE_TYYPPI = "yhteystietotyyppi8";

	public static final String TILAPAINEN_KOTIMAAN_OSOITE_TYYPPI = "yhteystietotyyppi9";

	public static final String TILAPAINEN_ULKOMAAN_OSOITE_TYYPPI = "yhteystietotyyppi10";

	public static final String KOTIMAINEN_POSTIOSOITE_TYYPPI = "yhteystietotyyppi11";

	public static final String ULKOMAINEN_POSTIOSOITE_TYYPPI = "yhteystietotyyppi12";

	public static final List<String> prioritisedOrdering = new ArrayList<>(
			Arrays.asList(TILAPAINEN_KOTIMAAN_OSOITE_TYYPPI, TILAPAINEN_ULKOMAAN_OSOITE_TYYPPI,
					VAKINAINEN_KOTIMAAN_OSOITE_TYYPPI, VAKINAINEN_ULKOMAAN_OSOITE_TYYPPI, KOTIMAINEN_POSTIOSOITE_TYYPPI,
					ULKOMAINEN_POSTIOSOITE_TYYPPI, SAHKOINEN_OSOITE_TYYPPI));

}

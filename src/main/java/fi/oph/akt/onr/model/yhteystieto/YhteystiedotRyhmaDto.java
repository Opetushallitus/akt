package fi.oph.akt.onr.model.yhteystieto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.Valid;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
public class YhteystiedotRyhmaDto implements Serializable {

	private static final long serialVersionUID = 7820975061439666995L;

	private Long id;

	private String ryhmaKuvaus;

	private String ryhmaAlkuperaTieto;

	private boolean readOnly;

	@Valid
	private Set<YhteystietoDto> yhteystieto = new HashSet<>();

}

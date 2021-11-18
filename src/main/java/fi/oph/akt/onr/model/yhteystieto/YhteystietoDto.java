package fi.oph.akt.onr.model.yhteystieto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.io.Serializable;

@AllArgsConstructor
@Getter
@Setter
public class YhteystietoDto implements Serializable {

	private static final long serialVersionUID = 4785135498967497621L;

	@NotNull
	private YhteystietoType yhteystietoTyyppi;

	private String yhteystietoArvo;

}

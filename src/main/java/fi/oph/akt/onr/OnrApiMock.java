package fi.oph.akt.onr;

import fi.oph.akt.onr.model.HenkiloDto;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class OnrApiMock extends OnrApi {

	@Resource
	private HenkiloDtoFactory henkiloDtoFactory;

	@Override
	public List<HenkiloDto> getHenkiloDtos(List<String> oids) {
		return oids.stream().map(henkiloDtoFactory::createHenkiloDto).toList();
	}

}

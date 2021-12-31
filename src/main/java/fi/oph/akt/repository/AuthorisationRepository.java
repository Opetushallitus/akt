package fi.oph.akt.repository;

import fi.oph.akt.model.Authorisation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuthorisationRepository extends JpaRepository<Authorisation, Long> {

	// @formatter:off
    @Query("SELECT new fi.oph.akt.repository.TranslatorAuthorisationProjection(t.id, a) FROM Authorisation a"
            + " JOIN a.translator t WHERE t.id IN ?1")
    // @formatter:on
	List<TranslatorAuthorisationProjection> findAuthorisationsByTranslators(Iterable<Long> translatorIds);

}

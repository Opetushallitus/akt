package fi.oph.akt.repository;

import fi.oph.akt.model.AuthorisationTerm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuthorisationTermRepository extends JpaRepository<AuthorisationTerm, Long> {

	@Query("SELECT new fi.oph.akt.repository.AuthorisationTermProjection(at.authorisation.id, at.beginDate, at.endDate)"
			+ " FROM AuthorisationTerm at")
	List<AuthorisationTermProjection> listAuthorisationTermProjections();

	@Query("SELECT new fi.oph.akt.repository.AuthorisationTermProjection(at.authorisation.id, at.beginDate, at.endDate)"
			+ " FROM AuthorisationTerm at WHERE at.authorisation.id IN ?1")
	List<AuthorisationTermProjection> listAuthorisationTermProjectionsByAuthorisations(Iterable<Long> authorisationIds);

}

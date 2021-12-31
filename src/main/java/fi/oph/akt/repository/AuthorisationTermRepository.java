package fi.oph.akt.repository;

import fi.oph.akt.model.AuthorisationTerm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuthorisationTermRepository extends JpaRepository<AuthorisationTerm, Long> {

	// @formatter:off
    @Query("SELECT new fi.oph.akt.repository.AuthorisationTermProjection(a.id, at) FROM AuthorisationTerm at"
            + " JOIN at.authorisation a WHERE a.id IN ?1")
    // @formatter:on
	List<AuthorisationTermProjection> findTermsByAuthorisations(Iterable<Long> authorisationIds);

}

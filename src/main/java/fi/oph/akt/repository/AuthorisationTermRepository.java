package fi.oph.akt.repository;

import fi.oph.akt.model.AuthorisationTerm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AuthorisationTermRepository extends JpaRepository<AuthorisationTerm, Long> {

	@Query("SELECT new fi.oph.akt.repository.AuthorisationTermProjection(at.authorisation.id, at.beginDate, at.endDate)"
			+ " FROM AuthorisationTerm at")
	List<AuthorisationTermProjection> listAuthorisationTermProjections();

	// @formatter:off
	@Query("SELECT at.id"
			+ " FROM AuthorisationTerm at"
			+ " LEFT JOIN at.reminders atr"
			+ " WHERE at.endDate BETWEEN ?1 AND ?2"
			+ " GROUP BY at.id, atr.id"
			+ " HAVING COUNT(atr.id) <= ?3")
	// @formatter:on
	List<Long> findAuthorisationTermsExpiringBetween(LocalDate start, LocalDate end, long maxReminderCount);

	// @formatter:off
	@Query("SELECT new fi.oph.akt.repository.AuthorisationExpiryDataProjection(a.id, t.id)"
			+ " FROM Translator t"
			+ " JOIN t.authorisations a"
			+ " JOIN a.terms at"
			+ " WHERE at.id = ?1")
	// @formatter:on
	AuthorisationExpiryDataProjection getExpiryDataProjection(long authorisationTermId);

}

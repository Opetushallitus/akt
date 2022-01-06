package fi.oph.akt.repository;

import fi.oph.akt.model.MeetingDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeetingDateRepository extends JpaRepository<MeetingDate, Long> {

	// @formatter:off
	@Query("SELECT new fi.oph.akt.repository.AuthorisationMeetingDateProjection(a.id, md.date)"
			+ " FROM MeetingDate md"
			+ " JOIN md.authorisations a"
			+ " WHERE a.id IN ?1")
	// @formatter:on
	List<AuthorisationMeetingDateProjection> listAuthorisationMeetingDatesByAuthorisations(
			Iterable<Long> authorisationIds);

}

package fi.oph.akt.repository;

import fi.oph.akt.model.MeetingDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeetingDateRepository extends JpaRepository<MeetingDate, Long> {

	@Query("SELECT new fi.oph.akt.repository.MeetingDateProjection(md.id, md.date) FROM MeetingDate md")
	List<MeetingDateProjection> listMeetingDateProjections();

	// @formatter:off
	@Query("SELECT new fi.oph.akt.repository.AuthorisationMeetingDateProjection(a.id, md.date)"
			+ " FROM MeetingDate md"
			+ " JOIN md.authorisations a")
	// @formatter:on
	List<AuthorisationMeetingDateProjection> listAuthorisationMeetingDateProjections();

}

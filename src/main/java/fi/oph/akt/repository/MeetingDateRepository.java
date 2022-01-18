package fi.oph.akt.repository;

import fi.oph.akt.model.MeetingDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface MeetingDateRepository extends JpaRepository<MeetingDate, Long> {
  @Query("SELECT new fi.oph.akt.repository.MeetingDateProjection(md.id, md.date) FROM MeetingDate md")
  List<MeetingDateProjection> listMeetingDateProjections();

  @Query(
    "SELECT new fi.oph.akt.repository.AuthorisationMeetingDateProjection(a.id, md.date)" +
    " FROM MeetingDate md" +
    " JOIN md.authorisations a"
  )
  List<AuthorisationMeetingDateProjection> listAuthorisationMeetingDateProjections();
}

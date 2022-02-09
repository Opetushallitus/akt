package fi.oph.akt.repository;

import fi.oph.akt.model.MeetingDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface MeetingDateRepository extends JpaRepository<MeetingDate, Long> {
  @Query("SELECT new fi.oph.akt.repository.MeetingDateProjection(md.id, md.version, md.date) FROM MeetingDate md")
  List<MeetingDateProjection> listMeetingDateProjections();
}

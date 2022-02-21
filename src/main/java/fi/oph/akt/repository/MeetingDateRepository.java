package fi.oph.akt.repository;

import fi.oph.akt.model.MeetingDate;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface MeetingDateRepository extends JpaRepository<MeetingDate, Long> {
  List<MeetingDate> findAllByOrderByDateDesc();

  @Query("SELECT md.date FROM MeetingDate md WHERE md.date > CURRENT_DATE ORDER BY md.date ASC")
  Optional<LocalDate> findNextMeetingDate();
}

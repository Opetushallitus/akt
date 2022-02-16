package fi.oph.akt.repository;

import fi.oph.akt.model.MeetingDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MeetingDateRepository extends JpaRepository<MeetingDate, Long>

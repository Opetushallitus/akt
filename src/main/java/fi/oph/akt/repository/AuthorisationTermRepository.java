package fi.oph.akt.repository;

import fi.oph.akt.model.AuthorisationTerm;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthorisationTermRepository extends JpaRepository<AuthorisationTerm, Long> {
  @Query(
    "SELECT new fi.oph.akt.repository.AuthorisationTermProjection(at.id, at.version, at.authorisation.id, at.beginDate, at.endDate)" +
    " FROM AuthorisationTerm at"
  )
  List<AuthorisationTermProjection> listAuthorisationTermProjections();

  @Query(
    "SELECT at.id" +
    " FROM AuthorisationTerm at" +
    " JOIN at.authorisation a" +
    " JOIN a.translator t" +
    " LEFT JOIN at.reminders atr" +
    " WHERE at.endDate BETWEEN ?1 AND ?2 AND t.email IS NOT NULL" +
    " GROUP BY at.id, atr.id" +
    " HAVING COUNT(atr.id) = 0 OR MAX(atr.createdAt) < ?3"
  )
  List<Long> findExpiringAuthorisationTerms(
    LocalDate betweenStart,
    LocalDate betweenEnd,
    LocalDateTime previousReminderSentBefore
  );

  @Query(
    "SELECT new fi.oph.akt.repository.AuthorisationExpiryDataProjection(a.fromLang, a.toLang, t.id)" +
    " FROM Translator t" +
    " JOIN t.authorisations a" +
    " JOIN a.terms at" +
    " WHERE at.id = ?1"
  )
  AuthorisationExpiryDataProjection getExpiryDataProjection(long authorisationTermId);
}

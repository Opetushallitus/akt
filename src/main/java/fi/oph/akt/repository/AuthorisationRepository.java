package fi.oph.akt.repository;

import fi.oph.akt.model.Authorisation;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthorisationRepository extends JpaRepository<Authorisation, Long> {
  @Query(
    "SELECT new fi.oph.akt.repository.AuthorisationProjection(a.id, a.version, a.translator.id, md.date, a.basis, " +
    "a.diaryNumber, a.autDate, a.kktCheck, a.virDate, a.assuranceDate, a.fromLang, a.toLang, a.permissionToPublish) " +
    "FROM Authorisation a LEFT JOIN a.meetingDate md"
  )
  List<AuthorisationProjection> listAuthorisationProjections();

  @Query(
    "SELECT new fi.oph.akt.repository.TranslatorLanguagePairProjection(t.id, aut.fromLang, aut.toLang)" +
    " FROM Authorisation aut" +
    " JOIN aut.translator t" +
    " JOIN aut.terms term" +
    " WHERE aut.permissionToPublish=true" +
    " AND CURRENT_DATE >= term.beginDate" +
    " AND (CURRENT_DATE <= term.endDate OR term.endDate IS NULL)" +
    " GROUP BY t.id, aut.fromLang, aut.toLang"
  )
  List<TranslatorLanguagePairProjection> findTranslatorLanguagePairsForPublicListing();

  @Query("SELECT DISTINCT a.fromLang FROM Authorisation a ORDER BY a.fromLang")
  List<String> getDistinctFromLangs();

  @Query("SELECT DISTINCT a.toLang FROM Authorisation a ORDER BY a.toLang")
  List<String> getDistinctToLangs();
}

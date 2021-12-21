package fi.oph.akt.repository;

import fi.oph.akt.model.LanguagePair;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LanguagePairRepository extends JpaRepository<LanguagePair, Long> {

	@Query("SELECT new fi.oph.akt.repository.TranslatorLanguagePairProjection(t.id, lp.fromLang, lp.toLang, lp.permissionToPublish) FROM LanguagePair lp"
			+ " JOIN lp.authorisation a JOIN a.translator t WHERE t.id IN ?1")
	List<TranslatorLanguagePairProjection> findTranslatorLanguagePairs(Iterable<Long> translatorIds);

	@Query("SELECT new fi.oph.akt.repository.TranslatorLanguagePairProjection(t.id, lp.fromLang, lp.toLang, lp.permissionToPublish) FROM LanguagePair lp"
			+ " JOIN lp.authorisation a JOIN a.translator t WHERE lp.permissionToPublish=true AND t.id IN ?1")
	List<TranslatorLanguagePairProjection> findTranslatorLanguagePairsForPublicListing(Iterable<Long> translatorIds);

	@Query("SELECT DISTINCT lp.fromLang FROM LanguagePair lp ORDER BY lp.fromLang")
	List<String> getDistinctFromLangs();

	@Query("SELECT DISTINCT lp.toLang FROM LanguagePair lp ORDER BY lp.toLang")
	List<String> getDistinctToLangs();

}

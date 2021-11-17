package fi.oph.akt.repository;

import fi.oph.akt.model.LanguagePair;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface LanguagePairRepository extends JpaRepository<LanguagePair, Long> {

	@Query("SELECT new fi.oph.akt.repository.TranslatorLanguagePairProjection(t.id, lp.fromLang, lp.toLang) FROM LanguagePair lp"
			+ " JOIN lp.authorisation a JOIN a.translator t WHERE t.id IN ?1")
	List<TranslatorLanguagePairProjection> findTranslatorLanguagePairs(Iterable<Long> translatorIds);

	@Query("SELECT new fi.oph.akt.repository.TranslatorLanguagePairProjection(t.id, lp.fromLang, lp.toLang) FROM LanguagePair lp"
			+ " JOIN lp.authorisation a JOIN a.translator t WHERE lp.permissionToPublish=true AND t.id IN ?1")
	List<TranslatorLanguagePairProjection> findTranslatorLanguagePairsForPublicListing(Iterable<Long> translatorIds);

}

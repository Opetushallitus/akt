package fi.oph.akt.repository;

import fi.oph.akt.model.Translator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TranslatorRepository extends JpaRepository<Translator, Long> {

	// @formatter:off
	@Query("SELECT t.id FROM Translator t" +
			" JOIN t.authorisations aut" +
			" JOIN aut.terms term" +
			" JOIN aut.languagePairs pair" +
			" WHERE pair.permissionToPublish=true" +
			" AND CURRENT_DATE BETWEEN term.beginDate AND term.endDate")
	// @formatter:on
	Page<Long> findIDsForPublicListing(Pageable pageable);

}
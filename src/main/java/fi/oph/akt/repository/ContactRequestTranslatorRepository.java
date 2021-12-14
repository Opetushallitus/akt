package fi.oph.akt.repository;

import fi.oph.akt.model.ContactRequestTranslator;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRequestTranslatorRepository extends JpaRepository<ContactRequestTranslator, Long> {

}

package fi.oph.akt.model;

import java.util.Collection;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "translator")
public class Translator extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "translator_id", nullable = false)
	private long id;

	@Column(name = "onr_oid", nullable = false)
	private String onrOid;

	@OneToMany(mappedBy = "translator")
	private Collection<Authorisation> authorisations;

	public long getId() {
		return id;
	}

	public void setId(final long translatorId) {
		this.id = translatorId;
	}

	public String getOnrOid() {
		return onrOid;
	}

	public void setOnrOid(final String onrOid) {
		this.onrOid = onrOid;
	}

	public Collection<Authorisation> getAuthorisations() {
		return authorisations;
	}

	public void setAuthorisations(final Collection<Authorisation> authorisationsByTranslatorId) {
		this.authorisations = authorisationsByTranslatorId;
	}

}

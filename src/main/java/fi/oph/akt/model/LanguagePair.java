package fi.oph.akt.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "language_pair")
public class LanguagePair extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "language_pair_id", nullable = false)
	private long id;

	@Column(name = "from_lang", nullable = false, length = 10)
	private String fromLang;

	@Column(name = "to_lang", nullable = false, length = 10)
	private String toLang;

	@Column(name = "permission_to_publish", nullable = false)
	private boolean permissionToPublish;

	@ManyToOne
	@JoinColumn(name = "authorisation_id", referencedColumnName = "authorisation_id", nullable = false)
	private Authorisation authorisations;

	public long getId() {
		return id;
	}

	public void setId(final long languagePairId) {
		this.id = languagePairId;
	}

	public String getFromLang() {
		return fromLang;
	}

	public void setFromLang(final String fromLang) {
		this.fromLang = fromLang;
	}

	public String getToLang() {
		return toLang;
	}

	public void setToLang(final String toLang) {
		this.toLang = toLang;
	}

	public boolean getPermissionToPublish() {
		return permissionToPublish;
	}

	public void setPermissionToPublish(final boolean permissionToPublish) {
		this.permissionToPublish = permissionToPublish;
	}

	public Authorisation getAuthorisations() {
		return authorisations;
	}

	public void setAuthorisations(final Authorisation authorisationByAuthorisationId) {
		this.authorisations = authorisationByAuthorisationId;
	}

}

package fi.oph.akt.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
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

}

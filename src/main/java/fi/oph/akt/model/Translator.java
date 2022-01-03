package fi.oph.akt.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.Collection;

@Getter
@Setter
@Entity
@Table(name = "translator")
public class Translator extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "translator_id", nullable = false)
	private long id;

	@OneToMany(mappedBy = "translator")
	private Collection<Authorisation> authorisations;

	@OneToMany(mappedBy = "translator")
	private Collection<ContactRequestTranslator> contactRequestTranslators;

	// @Max(255)
	@Column(name = "ssn", unique = true)
	private String ssn;

	@Column(name = "first_name", nullable = false)
	private String firstName;

	@Column(name = "last_name", nullable = false)
	private String lastName;

	@Column(name = "email")
	private String email;

	@Column(name = "phone_number")
	private String phone;

	@Column(name = "street")
	private String street;

	@Column(name = "town")
	private String town;

	@Column(name = "postal_code")
	private String postalCode;

	@Column(name = "country")
	private String country;

}

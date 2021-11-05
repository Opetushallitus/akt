package fi.oph.akt.model;

import java.time.LocalDate;
import java.util.Collection;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "authorisation_term")
public class AuthorisationTerm extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "authorisation_term_id", nullable = false)
	private long id;

	@Column(name = "begin_date", nullable = false)
	private LocalDate beginDate;

	@Column(name = "end_date")
	private LocalDate endDate;

	@ManyToOne
	@JoinColumn(name = "authorisation_id", referencedColumnName = "authorisation_id", nullable = false)
	private Authorisation authorisations;

	@OneToMany(mappedBy = "authorisationTerm")
	private Collection<AuthorisationTermReminder> authorisationTermReminders;

	public long getId() {
		return id;
	}

	public void setId(final long authorisationTermId) {
		this.id = authorisationTermId;
	}

	public LocalDate getBeginDate() {
		return beginDate;
	}

	public void setBeginDate(final LocalDate beginDate) {
		this.beginDate = beginDate;
	}

	public LocalDate getEndDate() {
		return endDate;
	}

	public void setEndDate(final LocalDate endDate) {
		this.endDate = endDate;
	}

	public Authorisation getAuthorisations() {
		return authorisations;
	}

	public void setAuthorisations(final Authorisation authorisations) {
		this.authorisations = authorisations;
	}

	public Collection<AuthorisationTermReminder> getValidityReminders() {
		return authorisationTermReminders;
	}

	public void setValidityReminders(final Collection<AuthorisationTermReminder> authorisationTermReminders) {
		this.authorisationTermReminders = authorisationTermReminders;
	}

}

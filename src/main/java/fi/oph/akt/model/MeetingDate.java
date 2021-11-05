package fi.oph.akt.model;

import java.time.LocalDate;
import java.util.Collection;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "meeting_date")
public class MeetingDate extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "meeting_date_id", nullable = false)
	private long id;

	@Column(name = "date", nullable = false)
	private LocalDate date;

	@OneToMany(mappedBy = "meetingDate")
	private Collection<Authorisation> authorisations;

	public long getId() {
		return id;
	}

	public void setId(final long meetingDateId) {
		this.id = meetingDateId;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(final LocalDate date) {
		this.date = date;
	}

	public Collection<Authorisation> getAuthorisations() {
		return authorisations;
	}

	public void setAuthorisations(final Collection<Authorisation> authorisationsByMeetingDateId) {
		this.authorisations = authorisationsByMeetingDateId;
	}

}

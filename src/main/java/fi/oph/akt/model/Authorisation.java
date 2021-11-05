package fi.oph.akt.model;

import java.time.LocalDate;
import java.util.Collection;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "authorisation")
public class Authorisation extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "authorisation_id", nullable = false)
	private long id;

	@Column(name = "aut_date")
	private LocalDate autDate;

	@Column(name = "kkt_check", length = -1)
	private String kktCheck;

	@Column(name = "vir_date")
	private LocalDate virDate;

	@Column(name = "assurance_date")
	private LocalDate assuranceDate;

	@ManyToOne
	@JoinColumn(name = "translator_id", referencedColumnName = "translator_id", nullable = false)
	private Translator translator;

	@Column(name = "basis", nullable = false)
	@Enumerated(value = EnumType.STRING)
	private Justification basis;

	@ManyToOne
	@JoinColumn(name = "meeting_date_id", referencedColumnName = "meeting_date_id")
	private MeetingDate meetingDate;

	@OneToMany(mappedBy = "authorisations")
	private Collection<LanguagePair> languagePairs;

	@OneToMany(mappedBy = "authorisations")
	private Collection<AuthorisationTerm> validities;

	public long getId() {
		return id;
	}

	public void setId(final long authorisationId) {
		this.id = authorisationId;
	}

	public LocalDate getAutDate() {
		return autDate;
	}

	public void setAutDate(final LocalDate autDate) {
		this.autDate = autDate;
	}

	public String getKktCheck() {
		return kktCheck;
	}

	public void setKktCheck(final String kktCheck) {
		this.kktCheck = kktCheck;
	}

	public LocalDate getVirDate() {
		return virDate;
	}

	public void setVirDate(final LocalDate virDate) {
		this.virDate = virDate;
	}

	public LocalDate getAssuranceDate() {
		return assuranceDate;
	}

	public void setAssuranceDate(final LocalDate assuranceDate) {
		this.assuranceDate = assuranceDate;
	}

	public Translator getTranslator() {
		return translator;
	}

	public void setTranslator(final Translator translatorByTranslatorId) {
		this.translator = translatorByTranslatorId;
	}

	public Justification getBasis() {
		return basis;
	}

	public void setBasis(final Justification justificationByJustificationName) {
		this.basis = justificationByJustificationName;
	}

	public MeetingDate getMeetingDate() {
		return meetingDate;
	}

	public void setMeetingDate(final MeetingDate meetingDateByMeetingDateId) {
		this.meetingDate = meetingDateByMeetingDateId;
	}

	public Collection<LanguagePair> getLanguagePairs() {
		return languagePairs;
	}

	public void setLanguagePairs(final Collection<LanguagePair> languagePairsByAuthorisationId) {
		this.languagePairs = languagePairsByAuthorisationId;
	}

	public Collection<AuthorisationTerm> getValidities() {
		return validities;
	}

	public void setValidities(final Collection<AuthorisationTerm> validitiesByAuthorisationId) {
		this.validities = validitiesByAuthorisationId;
	}

}

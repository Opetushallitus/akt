package fi.oph.akt.model;

import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Version;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@MappedSuperclass
public class BaseEntity {

	@Version
	@Column(name = "version", nullable = false)
	private int version;

	@Column(name = "created_by", length = -1)
	private String createdBy;

	@Column(name = "modified_by", length = -1)
	private String modifiedBy;

	@Column(name = "deleted_by", length = -1)
	private String deletedBy;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	@Column(name = "modified_at", nullable = false)
	private LocalDateTime modifiedAt;

	@Column(name = "deleted_at")
	private LocalDateTime deletedAt;

	private String getCurrentUserId() {
		// TODO
		return "TODO" + java.time.LocalTime.now();
	}

	@PrePersist
	protected void prePersist() {
		final LocalDateTime now = LocalDateTime.now();
		setCreatedAt(now);
		setModifiedAt(now);

		final String currentUser = getCurrentUserId();
		if (getCreatedBy() == null) {
			setCreatedBy(currentUser);
			setModifiedBy(currentUser);
		}
	}

	@PreUpdate
	void preUpdate() {
		final LocalDateTime now = LocalDateTime.now();
		setModifiedAt(now);

		final String currentUser = getCurrentUserId();
		setModifiedBy(currentUser);
	}

}

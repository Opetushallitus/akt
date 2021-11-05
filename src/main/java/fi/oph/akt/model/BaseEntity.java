package fi.oph.akt.model;

import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Version;

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

	public int getVersion() {
		return version;
	}

	public void setVersion(final int version) {
		this.version = version;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(final String createdBy) {
		this.createdBy = createdBy;
	}

	public String getModifiedBy() {
		return modifiedBy;
	}

	public void setModifiedBy(final String modifiedBy) {
		this.modifiedBy = modifiedBy;
	}

	public String getDeletedBy() {
		return deletedBy;
	}

	public void setDeletedBy(final String deletedBy) {
		this.deletedBy = deletedBy;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(final LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getModifiedAt() {
		return modifiedAt;
	}

	public void setModifiedAt(final LocalDateTime modifiedAt) {
		this.modifiedAt = modifiedAt;
	}

	public LocalDateTime getDeletedAt() {
		return deletedAt;
	}

	public void setDeletedAt(final LocalDateTime deletedAt) {
		this.deletedAt = deletedAt;
	}

}

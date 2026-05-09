package com.yaseminyumak.culinarygraphbackend.social.infrastructure;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "social_likes")
public class LikeEntity {

	@Id
	@Column(name = "id")
	private UUID id;

	@Column(name = "entity_type", nullable = false, length = 20)
	private String entityType;

	@Column(name = "entity_id", nullable = false)
	private UUID entityId;

	@Column(name = "username", nullable = false)
	private String username;

	@Column(name = "created_at", nullable = false)
	private Instant createdAt;

	@SuppressWarnings("unused")
	protected LikeEntity() {}

	public UUID getId() { return id; }
	public void setId(UUID id) { this.id = id; }
	public String getEntityType() { return entityType; }
	public void setEntityType(String entityType) { this.entityType = entityType; }
	public UUID getEntityId() { return entityId; }
	public void setEntityId(UUID entityId) { this.entityId = entityId; }
	public String getUsername() { return username; }
	public void setUsername(String username) { this.username = username; }
	public Instant getCreatedAt() { return createdAt; }
	public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

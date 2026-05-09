package com.yaseminyumak.culinarygraphbackend.social.domain;

import java.time.Instant;
import java.util.UUID;

public class Like {
	private final UUID id;
	private final String entityType;
	private final UUID entityId;
	private final String username;
	private final Instant createdAt;

	private Like(UUID id, String entityType, UUID entityId, String username, Instant createdAt) {
		this.id = id;
		this.entityType = entityType;
		this.entityId = entityId;
		this.username = username;
		this.createdAt = createdAt;
	}

	public static Like create(String entityType, UUID entityId, String username) {
		return new Like(UUID.randomUUID(), entityType, entityId, username, Instant.now());
	}

	public static Like fromPersistence(UUID id, String entityType, UUID entityId, String username, Instant createdAt) {
		return new Like(id, entityType, entityId, username, createdAt);
	}

	public UUID getId() { return id; }
	public String getEntityType() { return entityType; }
	public UUID getEntityId() { return entityId; }
	public String getUsername() { return username; }
	public Instant getCreatedAt() { return createdAt; }
}

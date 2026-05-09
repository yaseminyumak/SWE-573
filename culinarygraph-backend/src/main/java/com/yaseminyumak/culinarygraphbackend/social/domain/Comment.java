package com.yaseminyumak.culinarygraphbackend.social.domain;

import java.time.Instant;
import java.util.UUID;

public class Comment {
	private final UUID id;
	private final String entityType;
	private final UUID entityId;
	private final String username;
	private final String body;
	private final Instant createdAt;

	private Comment(UUID id, String entityType, UUID entityId, String username, String body, Instant createdAt) {
		this.id = id;
		this.entityType = entityType;
		this.entityId = entityId;
		this.username = username;
		this.body = body;
		this.createdAt = createdAt;
	}

	public static Comment create(String entityType, UUID entityId, String username, String body) {
		return new Comment(UUID.randomUUID(), entityType, entityId, username, body, Instant.now());
	}

	public static Comment fromPersistence(UUID id, String entityType, UUID entityId, String username, String body, Instant createdAt) {
		return new Comment(id, entityType, entityId, username, body, createdAt);
	}

	public UUID getId() { return id; }
	public String getEntityType() { return entityType; }
	public UUID getEntityId() { return entityId; }
	public String getUsername() { return username; }
	public String getBody() { return body; }
	public Instant getCreatedAt() { return createdAt; }
}

package com.yaseminyumak.culinarygraphbackend.heritage.domain;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

public class Heritage {

	private final UUID id;
	private String name;
	private String country;
	private String description;
	private String createdBy;
	private final Instant createdAt;
	private Instant updatedAt;

	private Heritage(UUID id, Instant createdAt) {
		this.id = id;
		this.createdAt = createdAt;
	}

	public static Heritage create(String name, String country, String description, String createdBy) {
		Objects.requireNonNull(name, "name cannot be null");
		Objects.requireNonNull(country, "country cannot be null");
		Objects.requireNonNull(description, "description cannot be null");
		Objects.requireNonNull(createdBy, "createdBy cannot be null");
		Heritage h = new Heritage(UUID.randomUUID(), Instant.now());
		h.name = name.trim();
		h.country = country.trim();
		h.description = description.trim();
		h.createdBy = createdBy;
		h.updatedAt = h.createdAt;
		return h;
	}

	public static Heritage fromPersistence(UUID id, String name, String country, String description,
	                                       String createdBy, Instant createdAt, Instant updatedAt) {
		Heritage h = new Heritage(id, createdAt);
		h.name = name;
		h.country = country;
		h.description = description;
		h.createdBy = createdBy;
		h.updatedAt = updatedAt != null ? updatedAt : createdAt;
		return h;
	}

	public void update(String name, String country, String description) {
		this.name = name != null ? name.trim() : this.name;
		this.country = country != null ? country.trim() : this.country;
		this.description = description != null ? description.trim() : this.description;
		this.updatedAt = Instant.now();
	}

	public UUID getId() { return id; }
	public String getName() { return name; }
	public String getCountry() { return country; }
	public String getDescription() { return description; }
	public String getCreatedBy() { return createdBy; }
	public Instant getCreatedAt() { return createdAt; }
	public Instant getUpdatedAt() { return updatedAt; }
}

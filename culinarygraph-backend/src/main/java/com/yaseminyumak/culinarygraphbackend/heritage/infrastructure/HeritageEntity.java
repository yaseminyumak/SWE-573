package com.yaseminyumak.culinarygraphbackend.heritage.infrastructure;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "heritage")
public class HeritageEntity {

	@Id
	@Column(name = "id")
	private UUID id;

	@Column(name = "name", nullable = false, length = 500)
	private String name;

	@Column(name = "country", nullable = false, length = 255)
	private String country;

	@Column(name = "description", nullable = false, columnDefinition = "TEXT")
	private String description;

	@Column(name = "created_by", nullable = false)
	private String createdBy;

	@Column(name = "created_at", nullable = false)
	private Instant createdAt;

	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	@SuppressWarnings("unused")
	protected HeritageEntity() {}

	public UUID getId() { return id; }
	public void setId(UUID id) { this.id = id; }
	public String getName() { return name; }
	public void setName(String name) { this.name = name; }
	public String getCountry() { return country; }
	public void setCountry(String country) { this.country = country; }
	public String getDescription() { return description; }
	public void setDescription(String description) { this.description = description; }
	public String getCreatedBy() { return createdBy; }
	public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
	public Instant getCreatedAt() { return createdAt; }
	public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
	public Instant getUpdatedAt() { return updatedAt; }
	public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}

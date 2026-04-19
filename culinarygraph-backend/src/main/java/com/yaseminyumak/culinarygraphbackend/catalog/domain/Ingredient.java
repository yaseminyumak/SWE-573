package com.yaseminyumak.culinarygraphbackend.catalog.domain;

import java.time.Instant;
import java.util.*;

/**
 * Ingredient aggregate root.
 */
public class Ingredient {

	private final UUID id;
	private String name;
	private String description;
	private String region;
	private Set<Season> seasons;
	private List<String> substitutes;
	private String provenanceStory;
	private String country;
	private Set<UUID> relatedTechniqueIds;
	private PublishStatus status;
	private String createdBy;
	private final Instant createdAt;
	private Instant updatedAt;

	private Ingredient(UUID id, Instant createdAt) {
		this.id = id;
		this.createdAt = createdAt;
	}

	public static Ingredient create(String name, String description, String region,
	                                Set<Season> seasons, List<String> substitutes,
	                                String provenanceStory, String country,
	                                Set<UUID> relatedTechniqueIds, String createdBy) {
		Objects.requireNonNull(name, "name cannot be null");
		Objects.requireNonNull(createdBy, "createdBy cannot be null");
		Ingredient i = new Ingredient(UUID.randomUUID(), Instant.now());
		i.name = name.trim();
		i.description = description != null ? description.trim() : "";
		i.region = region != null ? region.trim() : "";
		i.seasons = seasons != null ? new HashSet<>(seasons) : new HashSet<>();
		i.substitutes = substitutes != null ? new ArrayList<>(substitutes) : new ArrayList<>();
		i.provenanceStory = provenanceStory;
		i.country = country;
		i.relatedTechniqueIds = relatedTechniqueIds != null ? new HashSet<>(relatedTechniqueIds) : new HashSet<>();
		i.status = PublishStatus.PUBLISHED;
		i.createdBy = createdBy;
		i.updatedAt = i.createdAt;
		return i;
	}

	public static Ingredient fromPersistence(UUID id, String name, String description, String region,
	                                         Set<Season> seasons, List<String> substitutes,
	                                         String provenanceStory, String country,
	                                         Set<UUID> relatedTechniqueIds, PublishStatus status,
	                                         String createdBy, Instant createdAt, Instant updatedAt) {
		Ingredient i = new Ingredient(id, createdAt);
		i.name = name;
		i.description = description != null ? description : "";
		i.region = region != null ? region : "";
		i.seasons = seasons != null ? new HashSet<>(seasons) : new HashSet<>();
		i.substitutes = substitutes != null ? new ArrayList<>(substitutes) : new ArrayList<>();
		i.provenanceStory = provenanceStory;
		i.country = country;
		i.relatedTechniqueIds = relatedTechniqueIds != null ? new HashSet<>(relatedTechniqueIds) : new HashSet<>();
		i.status = status != null ? status : PublishStatus.DRAFT;
		i.createdBy = createdBy;
		i.updatedAt = updatedAt != null ? updatedAt : createdAt;
		return i;
	}

	public void update(String name, String description, String region, Set<Season> seasons,
	                   List<String> substitutes, String provenanceStory, String country,
	                   Set<UUID> relatedTechniqueIds) {
		this.name = name != null ? name.trim() : this.name;
		this.description = description != null ? description.trim() : "";
		this.region = region != null ? region.trim() : "";
		this.seasons = seasons != null ? new HashSet<>(seasons) : new HashSet<>();
		this.substitutes = substitutes != null ? new ArrayList<>(substitutes) : new ArrayList<>();
		this.provenanceStory = provenanceStory;
		this.country = country;
		this.relatedTechniqueIds = relatedTechniqueIds != null ? new HashSet<>(relatedTechniqueIds) : new HashSet<>();
		this.updatedAt = Instant.now();
	}

	public void publish() {
		if (this.status != PublishStatus.DRAFT) {
			throw new IllegalStateException("Only DRAFT ingredients can be published");
		}
		this.status = PublishStatus.PUBLISHED;
		this.updatedAt = Instant.now();
	}

	public void archive() {
		if (this.status == PublishStatus.ARCHIVED) {
			throw new IllegalStateException("Already archived");
		}
		this.status = PublishStatus.ARCHIVED;
		this.updatedAt = Instant.now();
	}

	public UUID getId() { return id; }
	public String getName() { return name; }
	public String getDescription() { return description; }
	public String getRegion() { return region; }
	public Set<Season> getSeasons() { return Collections.unmodifiableSet(seasons); }
	public List<String> getSubstitutes() { return Collections.unmodifiableList(substitutes); }
	public String getProvenanceStory() { return provenanceStory; }
	public String getCountry() { return country; }
	public Set<UUID> getRelatedTechniqueIds() { return Collections.unmodifiableSet(relatedTechniqueIds); }
	public PublishStatus getStatus() { return status; }
	public String getCreatedBy() { return createdBy; }
	public Instant getCreatedAt() { return createdAt; }
	public Instant getUpdatedAt() { return updatedAt; }
}

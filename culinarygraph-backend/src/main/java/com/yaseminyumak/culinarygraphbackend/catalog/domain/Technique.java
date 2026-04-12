package com.yaseminyumak.culinarygraphbackend.catalog.domain;

import java.time.Instant;
import java.util.*;

/**
 * Technique aggregate root.
 */
public class Technique {

	private final UUID id;
	private String name;
	private String description;
	private String region;
	private DifficultyLevel difficulty;
	private final List<TechniqueStep> steps;
	private final Set<UUID> ingredientIds;
	private String country;
	private String culturalNotes;
	private String prerequisites;
	private List<String> relatedTechniqueNames;
	private List<String> relatedIngredientNames;
	private PublishStatus status;
	private String createdBy;
	private final Instant createdAt;
	private Instant updatedAt;

	private Technique(UUID id, Instant createdAt, List<TechniqueStep> steps, Set<UUID> ingredientIds) {
		this.id = id;
		this.createdAt = createdAt;
		this.steps = new ArrayList<>(steps);
		this.ingredientIds = new HashSet<>(ingredientIds);
		this.relatedTechniqueNames = new ArrayList<>();
		this.relatedIngredientNames = new ArrayList<>();
	}

	public static Technique create(String name, String description, String region,
	                               DifficultyLevel difficulty, List<TechniqueStep> steps,
	                               Set<UUID> ingredientIds, String country, String culturalNotes,
	                               String prerequisites, List<String> relatedTechniqueNames,
	                               List<String> relatedIngredientNames, String createdBy) {
		Objects.requireNonNull(name, "name cannot be null");
		Objects.requireNonNull(createdBy, "createdBy cannot be null");
		Technique t = new Technique(UUID.randomUUID(), Instant.now(),
			steps != null ? steps : List.of(),
			ingredientIds != null ? ingredientIds : Set.of());
		t.name = name.trim();
		t.description = description != null ? description.trim() : "";
		t.region = region != null ? region.trim() : "";
		t.difficulty = difficulty != null ? difficulty : DifficultyLevel.MEDIUM;
		t.country = country;
		t.culturalNotes = culturalNotes;
		t.prerequisites = prerequisites;
		t.relatedTechniqueNames = relatedTechniqueNames != null ? new ArrayList<>(relatedTechniqueNames) : new ArrayList<>();
		t.relatedIngredientNames = relatedIngredientNames != null ? new ArrayList<>(relatedIngredientNames) : new ArrayList<>();
		t.status = PublishStatus.PUBLISHED;
		t.createdBy = createdBy;
		t.updatedAt = t.createdAt;
		return t;
	}

	public static Technique fromPersistence(UUID id, String name, String description, String region,
	                                        DifficultyLevel difficulty, List<TechniqueStep> steps,
	                                        Set<UUID> ingredientIds, String country, String culturalNotes,
	                                        String prerequisites, List<String> relatedTechniqueNames,
	                                        List<String> relatedIngredientNames, PublishStatus status,
	                                        String createdBy, Instant createdAt, Instant updatedAt) {
		Technique t = new Technique(id, createdAt,
			steps != null ? steps : List.of(),
			ingredientIds != null ? ingredientIds : Set.of());
		t.name = name;
		t.description = description != null ? description : "";
		t.region = region != null ? region : "";
		t.difficulty = difficulty != null ? difficulty : DifficultyLevel.MEDIUM;
		t.country = country;
		t.culturalNotes = culturalNotes;
		t.prerequisites = prerequisites;
		t.relatedTechniqueNames = relatedTechniqueNames != null ? new ArrayList<>(relatedTechniqueNames) : new ArrayList<>();
		t.relatedIngredientNames = relatedIngredientNames != null ? new ArrayList<>(relatedIngredientNames) : new ArrayList<>();
		t.status = status != null ? status : PublishStatus.DRAFT;
		t.createdBy = createdBy;
		t.updatedAt = updatedAt != null ? updatedAt : createdAt;
		return t;
	}

	public void publish() {
		if (this.status != PublishStatus.DRAFT) {
			throw new IllegalStateException("Only DRAFT techniques can be published");
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
	public DifficultyLevel getDifficulty() { return difficulty; }
	public List<TechniqueStep> getSteps() { return Collections.unmodifiableList(steps); }
	public Set<UUID> getIngredientIds() { return Collections.unmodifiableSet(ingredientIds); }
	public String getCountry() { return country; }
	public String getCulturalNotes() { return culturalNotes; }
	public String getPrerequisites() { return prerequisites; }
	public List<String> getRelatedTechniqueNames() { return Collections.unmodifiableList(relatedTechniqueNames); }
	public List<String> getRelatedIngredientNames() { return Collections.unmodifiableList(relatedIngredientNames); }
	public PublishStatus getStatus() { return status; }
	public String getCreatedBy() { return createdBy; }
	public Instant getCreatedAt() { return createdAt; }
	public Instant getUpdatedAt() { return updatedAt; }
}

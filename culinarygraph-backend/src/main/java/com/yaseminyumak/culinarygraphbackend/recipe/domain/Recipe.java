package com.yaseminyumak.culinarygraphbackend.recipe.domain;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

/**
 * Recipe aggregate root. Business rules live here; no anemic model.
 */
public class Recipe {

	private final UUID id;
	private String title;
	private String description;
	private DifficultyLevel difficulty;
	private Integer durationMinutes;
	private PublishStatus status;
	private String createdBy;
	private final Instant createdAt;
	private Instant updatedAt;
	private final List<RecipeStep> steps;
	private final List<RecipeIngredient> ingredients;
	private String country;
	private List<String> tags;
	private String originStory;
	private Set<UUID> associatedTechniqueIds;
	private List<String> specialDays;
	private Set<UUID> heritageIds;

	private Recipe(UUID id, Instant createdAt, List<RecipeStep> steps, List<RecipeIngredient> ingredients) {
		this.id = id;
		this.createdAt = createdAt;
		this.steps = new ArrayList<>(steps);
		this.ingredients = new ArrayList<>(ingredients);
		this.tags = new ArrayList<>();
		this.associatedTechniqueIds = new HashSet<>();
		this.specialDays = new ArrayList<>();
		this.heritageIds = new HashSet<>();
	}

	/**
	 * Reload from persistence (for repository impl).
	 */
	public static Recipe fromPersistence(UUID id, String title, String description, DifficultyLevel difficulty,
	                                     Integer durationMinutes, PublishStatus status, String createdBy,
	                                     Instant createdAt, Instant updatedAt,
	                                     List<RecipeStep> steps, List<RecipeIngredient> ingredients,
	                                     String country, List<String> tags, String originStory,
	                                     Set<UUID> associatedTechniqueIds, List<String> specialDays,
	                                     Set<UUID> heritageIds) {
		Recipe r = new Recipe(id, createdAt, steps != null ? steps : List.of(), ingredients != null ? ingredients : List.of());
		r.title = title;
		r.description = description != null ? description : "";
		r.difficulty = difficulty != null ? difficulty : DifficultyLevel.MEDIUM;
		r.durationMinutes = durationMinutes;
		r.status = status != null ? status : PublishStatus.DRAFT;
		r.createdBy = createdBy;
		r.updatedAt = updatedAt != null ? updatedAt : createdAt;
		r.country = country;
		r.tags = tags != null ? new ArrayList<>(tags) : new ArrayList<>();
		r.originStory = originStory;
		r.associatedTechniqueIds = associatedTechniqueIds != null ? new HashSet<>(associatedTechniqueIds) : new HashSet<>();
		r.specialDays = specialDays != null ? new ArrayList<>(specialDays) : new ArrayList<>();
		r.heritageIds = heritageIds != null ? new HashSet<>(heritageIds) : new HashSet<>();
		return r;
	}

	/**
	 * Create a new recipe (DRAFT).
	 */
	public static Recipe create(String title, String description, DifficultyLevel difficulty, Integer durationMinutes,
	                            String createdBy, List<RecipeStep> steps, List<RecipeIngredient> ingredients,
	                            String country, List<String> tags, String originStory,
	                            Set<UUID> associatedTechniqueIds, List<String> specialDays,
	                            Set<UUID> heritageIds) {
		Objects.requireNonNull(title, "title cannot be null");
		Objects.requireNonNull(createdBy, "createdBy cannot be null");
		Recipe r = new Recipe(UUID.randomUUID(), Instant.now(), steps != null ? steps : List.of(), ingredients != null ? ingredients : List.of());
		r.title = title.trim();
		r.description = description != null ? description.trim() : "";
		r.difficulty = difficulty != null ? difficulty : DifficultyLevel.MEDIUM;
		r.durationMinutes = durationMinutes != null && durationMinutes >= 0 ? durationMinutes : null;
		r.status = PublishStatus.PUBLISHED;
		r.createdBy = createdBy;
		r.updatedAt = r.createdAt;
		r.country = country;
		r.tags = tags != null ? new ArrayList<>(tags) : new ArrayList<>();
		r.originStory = originStory;
		r.associatedTechniqueIds = associatedTechniqueIds != null ? new HashSet<>(associatedTechniqueIds) : new HashSet<>();
		r.specialDays = specialDays != null ? new ArrayList<>(specialDays) : new ArrayList<>();
		r.heritageIds = heritageIds != null ? new HashSet<>(heritageIds) : new HashSet<>();
		return r;
	}

	public void update(String title, String description, DifficultyLevel difficulty, Integer durationMinutes,
	                   List<RecipeStep> steps, List<RecipeIngredient> ingredients, String country,
	                   List<String> tags, String originStory, Set<UUID> associatedTechniqueIds,
	                   List<String> specialDays, Set<UUID> heritageIds) {
		this.title = title != null ? title.trim() : this.title;
		this.description = description != null ? description.trim() : "";
		this.difficulty = difficulty != null ? difficulty : this.difficulty;
		this.durationMinutes = durationMinutes;
		this.steps.clear();
		if (steps != null) this.steps.addAll(steps);
		this.ingredients.clear();
		if (ingredients != null) this.ingredients.addAll(ingredients);
		this.country = country;
		this.tags = tags != null ? new ArrayList<>(tags) : new ArrayList<>();
		this.originStory = originStory;
		this.associatedTechniqueIds = associatedTechniqueIds != null ? new HashSet<>(associatedTechniqueIds) : new HashSet<>();
		this.specialDays = specialDays != null ? new ArrayList<>(specialDays) : new ArrayList<>();
		this.heritageIds = heritageIds != null ? new HashSet<>(heritageIds) : new HashSet<>();
		this.updatedAt = Instant.now();
	}

	public void publish() {
		if (this.status != PublishStatus.DRAFT) {
			throw new IllegalStateException("Only DRAFT recipes can be published");
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

	public boolean isPublished() {
		return this.status == PublishStatus.PUBLISHED;
	}

	public UUID getId() {
		return id;
	}

	public String getTitle() {
		return title;
	}

	public String getDescription() {
		return description;
	}

	public DifficultyLevel getDifficulty() {
		return difficulty;
	}

	public Integer getDurationMinutes() {
		return durationMinutes;
	}

	public PublishStatus getStatus() {
		return status;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}

	public List<RecipeStep> getSteps() {
		return Collections.unmodifiableList(steps);
	}

	public List<RecipeIngredient> getIngredients() {
		return Collections.unmodifiableList(ingredients);
	}

	public String getCountry() {
		return country;
	}

	public List<String> getTags() {
		return Collections.unmodifiableList(tags);
	}

	public String getOriginStory() {
		return originStory;
	}

	public Set<UUID> getAssociatedTechniqueIds() {
		return Collections.unmodifiableSet(associatedTechniqueIds);
	}

	public List<String> getSpecialDays() {
		return Collections.unmodifiableList(specialDays);
	}

	public Set<UUID> getHeritageIds() {
		return Collections.unmodifiableSet(heritageIds);
	}
}

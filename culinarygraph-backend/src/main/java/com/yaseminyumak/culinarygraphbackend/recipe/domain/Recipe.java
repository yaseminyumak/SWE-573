package com.yaseminyumak.culinarygraphbackend.recipe.domain;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
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

	private Recipe(UUID id, Instant createdAt, List<RecipeStep> steps, List<RecipeIngredient> ingredients) {
		this.id = id;
		this.createdAt = createdAt;
		this.steps = new ArrayList<>(steps);
		this.ingredients = new ArrayList<>(ingredients);
	}

	/**
	 * Reload from persistence (for repository impl).
	 */
	public static Recipe fromPersistence(UUID id, String title, String description, DifficultyLevel difficulty,
	                                     Integer durationMinutes, PublishStatus status, String createdBy,
	                                     Instant createdAt, Instant updatedAt,
	                                     List<RecipeStep> steps, List<RecipeIngredient> ingredients) {
		Recipe r = new Recipe(id, createdAt, steps != null ? steps : List.of(), ingredients != null ? ingredients : List.of());
		r.title = title;
		r.description = description != null ? description : "";
		r.difficulty = difficulty != null ? difficulty : DifficultyLevel.MEDIUM;
		r.durationMinutes = durationMinutes;
		r.status = status != null ? status : PublishStatus.DRAFT;
		r.createdBy = createdBy;
		r.updatedAt = updatedAt != null ? updatedAt : createdAt;
		return r;
	}

	/**
	 * Create a new recipe (DRAFT).
	 */
	public static Recipe create(String title, String description, DifficultyLevel difficulty, Integer durationMinutes,
	                            String createdBy, List<RecipeStep> steps, List<RecipeIngredient> ingredients) {
		Objects.requireNonNull(title, "title cannot be null");
		Objects.requireNonNull(createdBy, "createdBy cannot be null");
		Recipe r = new Recipe(UUID.randomUUID(), Instant.now(), steps != null ? steps : List.of(), ingredients != null ? ingredients : List.of());
		r.title = title.trim();
		r.description = description != null ? description.trim() : "";
		r.difficulty = difficulty != null ? difficulty : DifficultyLevel.MEDIUM;
		r.durationMinutes = durationMinutes != null && durationMinutes >= 0 ? durationMinutes : null;
		r.status = PublishStatus.DRAFT;
		r.createdBy = createdBy;
		r.updatedAt = r.createdAt;
		return r;
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
}

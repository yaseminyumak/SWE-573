package com.yaseminyumak.culinarygraphbackend.recipe.infrastructure;

import com.yaseminyumak.culinarygraphbackend.recipe.domain.DifficultyLevel;
import com.yaseminyumak.culinarygraphbackend.recipe.domain.PublishStatus;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "recipes")
public class RecipeEntity {

	@Id
	@Column(name = "id")
	private UUID id;

	@Column(name = "title", nullable = false, length = 500)
	private String title;

	@Column(name = "description", columnDefinition = "TEXT")
	private String description;

	@Enumerated(EnumType.STRING)
	@Column(name = "difficulty", nullable = false, length = 20)
	private DifficultyLevel difficulty;

	@Column(name = "duration_minutes")
	private Integer durationMinutes;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, length = 20)
	private PublishStatus status;

	@Column(name = "created_by", nullable = false)
	private String createdBy;

	@Column(name = "created_at", nullable = false)
	private Instant createdAt;

	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	@OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
	@OrderBy("stepOrder")
	private List<RecipeStepEntity> stepEntities = new ArrayList<>();

	@OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<RecipeIngredientEntity> ingredientEntities = new ArrayList<>();

	@SuppressWarnings("unused")
	protected RecipeEntity() {
	}

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public DifficultyLevel getDifficulty() {
		return difficulty;
	}

	public void setDifficulty(DifficultyLevel difficulty) {
		this.difficulty = difficulty;
	}

	public Integer getDurationMinutes() {
		return durationMinutes;
	}

	public void setDurationMinutes(Integer durationMinutes) {
		this.durationMinutes = durationMinutes;
	}

	public PublishStatus getStatus() {
		return status;
	}

	public void setStatus(PublishStatus status) {
		this.status = status;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Instant createdAt) {
		this.createdAt = createdAt;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(Instant updatedAt) {
		this.updatedAt = updatedAt;
	}

	public List<RecipeStepEntity> getStepEntities() {
		return stepEntities;
	}

	public List<RecipeIngredientEntity> getIngredientEntities() {
		return ingredientEntities;
	}
}

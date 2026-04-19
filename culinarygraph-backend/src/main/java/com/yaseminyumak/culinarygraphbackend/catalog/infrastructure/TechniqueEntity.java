package com.yaseminyumak.culinarygraphbackend.catalog.infrastructure;

import com.yaseminyumak.culinarygraphbackend.catalog.domain.DifficultyLevel;
import com.yaseminyumak.culinarygraphbackend.catalog.domain.PublishStatus;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.ArrayList;

@Entity
@Table(name = "techniques")
public class TechniqueEntity {

	@Id
	@Column(name = "id")
	private UUID id;

	@Column(name = "name", nullable = false, length = 500)
	private String name;

	@Column(name = "description", columnDefinition = "TEXT")
	private String description;

	@Column(name = "region")
	private String region;

	@Enumerated(EnumType.STRING)
	@Column(name = "difficulty", nullable = false, length = 20)
	private DifficultyLevel difficulty;

	@OneToMany(mappedBy = "technique", cascade = CascadeType.ALL, orphanRemoval = true)
	@OrderBy("stepOrder")
	private List<TechniqueStepEntity> stepEntities = new ArrayList<>();

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(
		name = "technique_ingredients",
		joinColumns = @JoinColumn(name = "technique_id"),
		inverseJoinColumns = @JoinColumn(name = "ingredient_id")
	)
	private Set<IngredientEntity> ingredientEntities = new HashSet<>();

	@Column(name = "country")
	private String country;

	@Column(name = "cultural_notes", columnDefinition = "TEXT")
	private String culturalNotes;

	@Column(name = "prerequisites", columnDefinition = "TEXT")
	private String prerequisites;

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(
		name = "technique_related_techniques",
		joinColumns = @JoinColumn(name = "technique_id"),
		inverseJoinColumns = @JoinColumn(name = "related_technique_id")
	)
	private Set<TechniqueEntity> relatedTechniques = new HashSet<>();

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, length = 20)
	private PublishStatus status;

	@Column(name = "created_by", nullable = false)
	private String createdBy;

	@Column(name = "created_at", nullable = false)
	private Instant createdAt;

	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	@SuppressWarnings("unused")
	protected TechniqueEntity() {}

	public UUID getId() { return id; }
	public void setId(UUID id) { this.id = id; }
	public String getName() { return name; }
	public void setName(String name) { this.name = name; }
	public String getDescription() { return description; }
	public void setDescription(String description) { this.description = description; }
	public String getRegion() { return region; }
	public void setRegion(String region) { this.region = region; }
	public DifficultyLevel getDifficulty() { return difficulty; }
	public void setDifficulty(DifficultyLevel difficulty) { this.difficulty = difficulty; }
	public List<TechniqueStepEntity> getStepEntities() { return stepEntities; }
	public Set<IngredientEntity> getIngredientEntities() { return ingredientEntities; }
	public void setIngredientEntities(Set<IngredientEntity> ingredientEntities) { this.ingredientEntities = ingredientEntities; }
	public String getCountry() { return country; }
	public void setCountry(String country) { this.country = country; }
	public String getCulturalNotes() { return culturalNotes; }
	public void setCulturalNotes(String culturalNotes) { this.culturalNotes = culturalNotes; }
	public String getPrerequisites() { return prerequisites; }
	public void setPrerequisites(String prerequisites) { this.prerequisites = prerequisites; }
	public Set<TechniqueEntity> getRelatedTechniques() { return relatedTechniques; }
	public void setRelatedTechniques(Set<TechniqueEntity> relatedTechniques) { this.relatedTechniques = relatedTechniques; }
	public PublishStatus getStatus() { return status; }
	public void setStatus(PublishStatus status) { this.status = status; }
	public String getCreatedBy() { return createdBy; }
	public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
	public Instant getCreatedAt() { return createdAt; }
	public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
	public Instant getUpdatedAt() { return updatedAt; }
	public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}

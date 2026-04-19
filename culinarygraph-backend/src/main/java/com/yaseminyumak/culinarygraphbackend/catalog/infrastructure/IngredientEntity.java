package com.yaseminyumak.culinarygraphbackend.catalog.infrastructure;

import com.yaseminyumak.culinarygraphbackend.catalog.domain.PublishStatus;
import com.yaseminyumak.culinarygraphbackend.catalog.domain.Season;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "ingredients")
public class IngredientEntity {

	@Id
	@Column(name = "id")
	private UUID id;

	@Column(name = "name", nullable = false, length = 500)
	private String name;

	@Column(name = "description", columnDefinition = "TEXT")
	private String description;

	@Column(name = "region")
	private String region;

	@ElementCollection(fetch = FetchType.LAZY)
	@CollectionTable(name = "ingredient_seasons", joinColumns = @JoinColumn(name = "ingredient_id"))
	@Column(name = "season", length = 20)
	@Enumerated(EnumType.STRING)
	private Set<Season> seasons = new HashSet<>();

	@ElementCollection(fetch = FetchType.LAZY)
	@CollectionTable(name = "ingredient_substitutes", joinColumns = @JoinColumn(name = "ingredient_id"))
	@Column(name = "substitute_name", length = 500)
	private List<String> substitutes = new ArrayList<>();

	@Column(name = "provenance_story", columnDefinition = "TEXT")
	private String provenanceStory;

	@Column(name = "country")
	private String country;

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(
		name = "ingredient_related_techniques",
		joinColumns = @JoinColumn(name = "ingredient_id"),
		inverseJoinColumns = @JoinColumn(name = "technique_id")
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
	protected IngredientEntity() {}

	public UUID getId() { return id; }
	public void setId(UUID id) { this.id = id; }
	public String getName() { return name; }
	public void setName(String name) { this.name = name; }
	public String getDescription() { return description; }
	public void setDescription(String description) { this.description = description; }
	public String getRegion() { return region; }
	public void setRegion(String region) { this.region = region; }
	public Set<Season> getSeasons() { return seasons; }
	public void setSeasons(Set<Season> seasons) { this.seasons = seasons; }
	public List<String> getSubstitutes() { return substitutes; }
	public void setSubstitutes(List<String> substitutes) { this.substitutes = substitutes; }
	public String getProvenanceStory() { return provenanceStory; }
	public void setProvenanceStory(String provenanceStory) { this.provenanceStory = provenanceStory; }
	public String getCountry() { return country; }
	public void setCountry(String country) { this.country = country; }
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

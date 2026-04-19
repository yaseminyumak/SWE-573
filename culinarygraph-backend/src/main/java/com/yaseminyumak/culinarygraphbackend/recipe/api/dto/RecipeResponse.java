package com.yaseminyumak.culinarygraphbackend.recipe.api.dto;

import com.yaseminyumak.culinarygraphbackend.recipe.domain.DifficultyLevel;
import com.yaseminyumak.culinarygraphbackend.recipe.domain.PublishStatus;
import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;

public record RecipeResponse(
	UUID id,
	String title,
	String description,
	DifficultyLevel difficulty,
	Integer durationMinutes,
	PublishStatus status,
	String createdBy,
	Instant createdAt,
	Instant updatedAt,
	List<StepDto> steps,
	List<IngredientDto> ingredients,
	String country,
	List<String> tags,
	String originStory,
	Set<UUID> associatedTechniqueIds
) {
	public record StepDto(int order, String instruction) {}
	public record IngredientDto(String name, String quantity, String unit, UUID ingredientId) {}
}

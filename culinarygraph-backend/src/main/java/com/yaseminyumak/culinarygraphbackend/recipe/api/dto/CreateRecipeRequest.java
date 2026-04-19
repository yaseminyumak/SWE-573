package com.yaseminyumak.culinarygraphbackend.recipe.api.dto;

import com.yaseminyumak.culinarygraphbackend.recipe.domain.DifficultyLevel;
import com.yaseminyumak.culinarygraphbackend.recipe.domain.PublishStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Set;
import java.util.UUID;

public record CreateRecipeRequest(
	@NotBlank String title,
	String description,
	DifficultyLevel difficulty,
	Integer durationMinutes,
	@NotNull List<StepInput> steps,
	@NotNull List<IngredientInput> ingredients,
	String country,
	List<String> tags,
	String originStory,
	Set<UUID> associatedTechniqueIds
) {
	public record StepInput(int order, @NotBlank String instruction) {}
	public record IngredientInput(@NotBlank String name, String quantity, String unit, UUID ingredientId) {}
}

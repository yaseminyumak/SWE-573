package com.yaseminyumak.culinarygraphbackend.catalog.api.dto;

import com.yaseminyumak.culinarygraphbackend.catalog.domain.DifficultyLevel;
import jakarta.validation.constraints.NotBlank;

import java.util.List;
import java.util.UUID;

public record CreateTechniqueRequest(
	@NotBlank String name,
	String description,
	String region,
	DifficultyLevel difficulty,
	List<StepInput> steps,
	List<UUID> ingredientIds,
	String country,
	String culturalNotes,
	String prerequisites,
	List<String> relatedTechniqueNames,
	List<String> relatedIngredientNames
) {
	public record StepInput(int order, @NotBlank String instruction) {}
}

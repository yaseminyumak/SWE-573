package com.yaseminyumak.culinarygraphbackend.catalog.api.dto;

import com.yaseminyumak.culinarygraphbackend.catalog.domain.DifficultyLevel;
import com.yaseminyumak.culinarygraphbackend.catalog.domain.PublishStatus;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;

public record TechniqueResponse(
	UUID id,
	String name,
	String description,
	String region,
	DifficultyLevel difficulty,
	List<StepDto> steps,
	Set<UUID> ingredientIds,
	String country,
	String culturalNotes,
	String prerequisites,
	List<String> relatedTechniqueNames,
	List<String> relatedIngredientNames,
	PublishStatus status,
	String createdBy,
	Instant createdAt,
	Instant updatedAt
) {
	public record StepDto(int order, String instruction) {}
}

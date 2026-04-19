package com.yaseminyumak.culinarygraphbackend.catalog.api.dto;

import com.yaseminyumak.culinarygraphbackend.catalog.domain.PublishStatus;
import com.yaseminyumak.culinarygraphbackend.catalog.domain.Season;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;

public record IngredientResponse(
	UUID id,
	String name,
	String description,
	String region,
	Set<Season> seasons,
	List<String> substitutes,
	String provenanceStory,
	String country,
	Set<UUID> relatedTechniqueIds,
	PublishStatus status,
	String createdBy,
	Instant createdAt,
	Instant updatedAt
) {}

package com.yaseminyumak.culinarygraphbackend.catalog.api.dto;

import com.yaseminyumak.culinarygraphbackend.catalog.domain.Season;
import jakarta.validation.constraints.NotBlank;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public record CreateIngredientRequest(
	@NotBlank String name,
	String description,
	String region,
	List<Season> seasons,
	List<String> substitutes,
	String provenanceStory,
	String country,
	Set<UUID> relatedTechniqueIds
) {}

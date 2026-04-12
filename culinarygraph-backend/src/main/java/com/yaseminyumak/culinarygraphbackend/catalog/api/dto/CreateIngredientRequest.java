package com.yaseminyumak.culinarygraphbackend.catalog.api.dto;

import com.yaseminyumak.culinarygraphbackend.catalog.domain.Season;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record CreateIngredientRequest(
	@NotBlank String name,
	String description,
	String region,
	List<Season> seasons,
	List<String> substitutes,
	String provenanceStory,
	String country,
	List<String> relatedTechniqueNames
) {}

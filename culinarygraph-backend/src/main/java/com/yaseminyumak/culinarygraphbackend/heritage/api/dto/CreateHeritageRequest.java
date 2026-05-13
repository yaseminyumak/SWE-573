package com.yaseminyumak.culinarygraphbackend.heritage.api.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateHeritageRequest(
	@NotBlank String name,
	@NotBlank String country,
	@NotBlank String description
) {}

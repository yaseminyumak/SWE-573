package com.yaseminyumak.culinarygraphbackend.social.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ToggleLikeRequest(
	@NotBlank String entityType,
	@NotNull String entityId
) {}

package com.yaseminyumak.culinarygraphbackend.social.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AddCommentRequest(
	@NotBlank String entityType,
	@NotNull String entityId,
	@NotBlank String body
) {}

package com.yaseminyumak.culinarygraphbackend.heritage.api.dto;

import java.time.Instant;
import java.util.UUID;

public record HeritageResponse(
	UUID id,
	String name,
	String country,
	String description,
	String createdBy,
	Instant createdAt,
	Instant updatedAt
) {}

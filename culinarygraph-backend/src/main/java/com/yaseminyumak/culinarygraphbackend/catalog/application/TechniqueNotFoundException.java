package com.yaseminyumak.culinarygraphbackend.catalog.application;

import java.util.UUID;

public class TechniqueNotFoundException extends RuntimeException {
	public TechniqueNotFoundException(UUID id) {
		super("Technique not found: " + id);
	}
}

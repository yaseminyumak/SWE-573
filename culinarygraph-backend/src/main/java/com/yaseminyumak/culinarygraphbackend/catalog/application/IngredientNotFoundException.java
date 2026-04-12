package com.yaseminyumak.culinarygraphbackend.catalog.application;

import java.util.UUID;

public class IngredientNotFoundException extends RuntimeException {
	public IngredientNotFoundException(UUID id) {
		super("Ingredient not found: " + id);
	}
}

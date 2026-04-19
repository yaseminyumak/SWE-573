package com.yaseminyumak.culinarygraphbackend.catalog.domain;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IngredientRepository {
	Ingredient save(Ingredient ingredient);
	Optional<Ingredient> findById(UUID id);
	List<Ingredient> findAll();
	void delete(Ingredient ingredient);
}

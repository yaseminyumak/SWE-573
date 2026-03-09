package com.yaseminyumak.culinarygraphbackend.recipe.domain;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Recipe aggregate persistence — domain interface; implementation in infrastructure.
 */
public interface RecipeRepository {

	Recipe save(Recipe recipe);

	Optional<Recipe> findById(UUID id);

	List<Recipe> findAll();
}

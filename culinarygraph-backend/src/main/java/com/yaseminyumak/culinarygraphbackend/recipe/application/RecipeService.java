package com.yaseminyumak.culinarygraphbackend.recipe.application;

import com.yaseminyumak.culinarygraphbackend.recipe.api.dto.CreateRecipeRequest;
import com.yaseminyumak.culinarygraphbackend.recipe.domain.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RecipeService {

	private final RecipeRepository recipeRepository;

	public RecipeService(RecipeRepository recipeRepository) {
		this.recipeRepository = recipeRepository;
	}

	@Transactional
	public Recipe create(CreateRecipeRequest request) {
		String createdBy = getCurrentUserId();
		List<RecipeStep> steps = request.steps().stream()
			.map(s -> new RecipeStep(s.order(), s.instruction()))
			.collect(Collectors.toList());
		List<RecipeIngredient> ingredients = request.ingredients().stream()
			.map(i -> new RecipeIngredient(i.name(), i.quantity(), i.unit(), i.ingredientId()))
			.collect(Collectors.toList());
		Recipe recipe = Recipe.create(
			request.title(),
			request.description(),
			request.difficulty(),
			request.durationMinutes(),
			createdBy,
			steps,
			ingredients,
			request.country(),
			request.tags(),
			request.originStory(),
			request.associatedTechniqueIds() != null ? new HashSet<>(request.associatedTechniqueIds()) : new HashSet<>()
		);
		return recipeRepository.save(recipe);
	}

	@Transactional(readOnly = true)
	public List<Recipe> findAll() {
		return recipeRepository.findAll();
	}

	@Transactional(readOnly = true)
	public Recipe getById(UUID id) {
		return recipeRepository.findById(id)
			.orElseThrow(() -> new RecipeNotFoundException(id));
	}

	@Transactional
	public Recipe update(UUID id, CreateRecipeRequest request) {
		Recipe recipe = getById(id);
		List<RecipeStep> steps = request.steps().stream()
			.map(s -> new RecipeStep(s.order(), s.instruction()))
			.collect(Collectors.toList());
		List<RecipeIngredient> ingredients = request.ingredients().stream()
			.map(i -> new RecipeIngredient(i.name(), i.quantity(), i.unit(), i.ingredientId()))
			.collect(Collectors.toList());
		recipe.update(
			request.title(), request.description(), request.difficulty(), request.durationMinutes(),
			steps, ingredients, request.country(), request.tags(), request.originStory(),
			request.associatedTechniqueIds() != null ? new HashSet<>(request.associatedTechniqueIds()) : new HashSet<>()
		);
		return recipeRepository.save(recipe);
	}

	@Transactional
	public void delete(UUID id) {
		Recipe recipe = getById(id);
		recipeRepository.delete(recipe);
	}

	@Transactional
	public Recipe publish(UUID id) {
		Recipe recipe = getById(id);
		recipe.publish();
		return recipeRepository.save(recipe);
	}

	@Transactional
	public Recipe archive(UUID id) {
		Recipe recipe = getById(id);
		recipe.archive();
		return recipeRepository.save(recipe);
	}

	private static String getCurrentUserId() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth != null && auth.isAuthenticated() && auth.getPrincipal() != null
			&& !"anonymousUser".equals(auth.getPrincipal().toString())) {
			return auth.getName();
		}
		// Local / dev: no JWT or anonymous -> use fallback so POST /api/recipes works
		return "local-dev-user";
	}
}

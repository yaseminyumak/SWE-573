package com.yaseminyumak.culinarygraphbackend.recipe.api;

import com.yaseminyumak.culinarygraphbackend.recipe.api.dto.CreateRecipeRequest;
import com.yaseminyumak.culinarygraphbackend.recipe.api.dto.RecipeResponse;
import com.yaseminyumak.culinarygraphbackend.recipe.application.RecipeNotFoundException;
import com.yaseminyumak.culinarygraphbackend.recipe.application.RecipeService;
import com.yaseminyumak.culinarygraphbackend.recipe.domain.Recipe;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

	private final RecipeService recipeService;

	public RecipeController(RecipeService recipeService) {
		this.recipeService = recipeService;
	}

	@PostMapping
	public ResponseEntity<RecipeResponse> create(@Valid @RequestBody CreateRecipeRequest request) {
		Recipe recipe = recipeService.create(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(recipe));
	}

	@GetMapping
	public List<RecipeResponse> list() {
		return recipeService.findAll().stream().map(this::toResponse).toList();
	}

	@GetMapping("/{id}")
	public RecipeResponse getById(@PathVariable UUID id) {
		Recipe recipe = recipeService.getById(id);
		return toResponse(recipe);
	}

	@PutMapping("/{id}")
	public RecipeResponse update(@PathVariable UUID id, @Valid @RequestBody CreateRecipeRequest request) {
		Recipe recipe = recipeService.update(id, request);
		return toResponse(recipe);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable UUID id) {
		recipeService.delete(id);
	}

	@PutMapping("/{id}/archive")
	public RecipeResponse archive(@PathVariable UUID id) {
		Recipe recipe = recipeService.archive(id);
		return toResponse(recipe);
	}

	@ExceptionHandler(RecipeNotFoundException.class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	public void handleNotFound() {
	}

	private RecipeResponse toResponse(Recipe r) {
		return new RecipeResponse(
			r.getId(),
			r.getTitle(),
			r.getDescription(),
			r.getDifficulty(),
			r.getDurationMinutes(),
			r.getStatus(),
			r.getCreatedBy(),
			r.getCreatedAt(),
			r.getUpdatedAt(),
			r.getSteps().stream().map(s -> new RecipeResponse.StepDto(s.getOrder(), s.getInstruction())).toList(),
			r.getIngredients().stream().map(i -> new RecipeResponse.IngredientDto(i.getName(), i.getQuantity(), i.getUnit(), i.getIngredientId())).toList(),
			r.getCountry(),
			r.getTags(),
			r.getOriginStory(),
			r.getAssociatedTechniqueIds()
		);
	}
}

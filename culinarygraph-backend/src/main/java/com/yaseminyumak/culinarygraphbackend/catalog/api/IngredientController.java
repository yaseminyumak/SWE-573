package com.yaseminyumak.culinarygraphbackend.catalog.api;

import com.yaseminyumak.culinarygraphbackend.catalog.api.dto.CreateIngredientRequest;
import com.yaseminyumak.culinarygraphbackend.catalog.api.dto.IngredientResponse;
import com.yaseminyumak.culinarygraphbackend.catalog.application.IngredientNotFoundException;
import com.yaseminyumak.culinarygraphbackend.catalog.application.IngredientService;
import com.yaseminyumak.culinarygraphbackend.catalog.domain.Ingredient;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/catalog/ingredients")
public class IngredientController {

	private final IngredientService ingredientService;

	public IngredientController(IngredientService ingredientService) {
		this.ingredientService = ingredientService;
	}

	@PostMapping
	public ResponseEntity<IngredientResponse> create(@Valid @RequestBody CreateIngredientRequest request) {
		Ingredient ingredient = ingredientService.create(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(ingredient));
	}

	@GetMapping
	public List<IngredientResponse> list() {
		return ingredientService.findAll().stream().map(this::toResponse).toList();
	}

	@GetMapping("/{id}")
	public IngredientResponse getById(@PathVariable UUID id) {
		return toResponse(ingredientService.getById(id));
	}

	@PutMapping("/{id}")
	public IngredientResponse update(@PathVariable UUID id, @Valid @RequestBody CreateIngredientRequest request) {
		return toResponse(ingredientService.update(id, request));
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable UUID id) {
		ingredientService.delete(id);
	}

	@PutMapping("/{id}/archive")
	public IngredientResponse archive(@PathVariable UUID id) {
		return toResponse(ingredientService.archive(id));
	}

	@ExceptionHandler(IngredientNotFoundException.class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	public void handleNotFound() {}

	private IngredientResponse toResponse(Ingredient i) {
		return new IngredientResponse(
			i.getId(), i.getName(), i.getDescription(), i.getRegion(),
			i.getSeasons(), i.getSubstitutes(), i.getProvenanceStory(),
			i.getCountry(), i.getRelatedTechniqueIds(),
			i.getStatus(), i.getCreatedBy(), i.getCreatedAt(), i.getUpdatedAt()
		);
	}
}

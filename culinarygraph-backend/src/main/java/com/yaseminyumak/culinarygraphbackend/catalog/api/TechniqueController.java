package com.yaseminyumak.culinarygraphbackend.catalog.api;

import com.yaseminyumak.culinarygraphbackend.catalog.api.dto.CreateTechniqueRequest;
import com.yaseminyumak.culinarygraphbackend.catalog.api.dto.TechniqueResponse;
import com.yaseminyumak.culinarygraphbackend.catalog.application.TechniqueNotFoundException;
import com.yaseminyumak.culinarygraphbackend.catalog.application.TechniqueService;
import com.yaseminyumak.culinarygraphbackend.catalog.domain.Technique;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/catalog/techniques")
public class TechniqueController {

	private final TechniqueService techniqueService;

	public TechniqueController(TechniqueService techniqueService) {
		this.techniqueService = techniqueService;
	}

	@PostMapping
	public ResponseEntity<TechniqueResponse> create(@Valid @RequestBody CreateTechniqueRequest request) {
		Technique technique = techniqueService.create(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(technique));
	}

	@GetMapping
	public List<TechniqueResponse> list() {
		return techniqueService.findAll().stream().map(this::toResponse).toList();
	}

	@GetMapping("/{id}")
	public TechniqueResponse getById(@PathVariable UUID id) {
		return toResponse(techniqueService.getById(id));
	}

	@PutMapping("/{id}/archive")
	public TechniqueResponse archive(@PathVariable UUID id) {
		return toResponse(techniqueService.archive(id));
	}

	@ExceptionHandler(TechniqueNotFoundException.class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	public void handleNotFound() {}

	private TechniqueResponse toResponse(Technique t) {
		return new TechniqueResponse(
			t.getId(), t.getName(), t.getDescription(), t.getRegion(),
			t.getDifficulty(),
			t.getSteps().stream().map(s -> new TechniqueResponse.StepDto(s.getOrder(), s.getInstruction())).toList(),
			t.getIngredientIds(),
			t.getCountry(), t.getCulturalNotes(), t.getPrerequisites(),
			t.getRelatedTechniqueNames(), t.getRelatedIngredientNames(),
			t.getStatus(), t.getCreatedBy(), t.getCreatedAt(), t.getUpdatedAt()
		);
	}
}

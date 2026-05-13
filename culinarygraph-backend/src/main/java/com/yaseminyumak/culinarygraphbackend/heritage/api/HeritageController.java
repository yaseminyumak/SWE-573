package com.yaseminyumak.culinarygraphbackend.heritage.api;

import com.yaseminyumak.culinarygraphbackend.heritage.api.dto.CreateHeritageRequest;
import com.yaseminyumak.culinarygraphbackend.heritage.api.dto.HeritageResponse;
import com.yaseminyumak.culinarygraphbackend.heritage.application.HeritageNotFoundException;
import com.yaseminyumak.culinarygraphbackend.heritage.application.HeritageService;
import com.yaseminyumak.culinarygraphbackend.heritage.domain.Heritage;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/heritage")
public class HeritageController {

	private final HeritageService heritageService;

	public HeritageController(HeritageService heritageService) {
		this.heritageService = heritageService;
	}

	@PostMapping
	public ResponseEntity<HeritageResponse> create(@Valid @RequestBody CreateHeritageRequest request) {
		Heritage heritage = heritageService.create(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(heritage));
	}

	@GetMapping
	public List<HeritageResponse> list() {
		return heritageService.findAll().stream().map(this::toResponse).toList();
	}

	@GetMapping("/{id}")
	public HeritageResponse getById(@PathVariable UUID id) {
		return toResponse(heritageService.getById(id));
	}

	@PutMapping("/{id}")
	public HeritageResponse update(@PathVariable UUID id, @Valid @RequestBody CreateHeritageRequest request) {
		return toResponse(heritageService.update(id, request));
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable UUID id) {
		heritageService.delete(id);
	}

	@ExceptionHandler(HeritageNotFoundException.class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	public void handleNotFound() {}

	private HeritageResponse toResponse(Heritage h) {
		return new HeritageResponse(
			h.getId(), h.getName(), h.getCountry(), h.getDescription(),
			h.getCreatedBy(), h.getCreatedAt(), h.getUpdatedAt()
		);
	}
}

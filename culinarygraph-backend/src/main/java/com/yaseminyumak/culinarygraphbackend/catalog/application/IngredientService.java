package com.yaseminyumak.culinarygraphbackend.catalog.application;

import com.yaseminyumak.culinarygraphbackend.catalog.api.dto.CreateIngredientRequest;
import com.yaseminyumak.culinarygraphbackend.catalog.domain.Ingredient;
import com.yaseminyumak.culinarygraphbackend.catalog.domain.IngredientRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class IngredientService {

	private final IngredientRepository ingredientRepository;

	public IngredientService(IngredientRepository ingredientRepository) {
		this.ingredientRepository = ingredientRepository;
	}

	@Transactional
	public Ingredient create(CreateIngredientRequest request) {
		String createdBy = getCurrentUserId();
		Ingredient ingredient = Ingredient.create(
			request.name(),
			request.description(),
			request.region(),
			request.seasons() != null ? new HashSet<>(request.seasons()) : new HashSet<>(),
			request.substitutes(),
			request.provenanceStory(),
			request.country(),
			request.relatedTechniqueIds() != null ? new HashSet<>(request.relatedTechniqueIds()) : new HashSet<>(),
			createdBy
		);
		return ingredientRepository.save(ingredient);
	}

	@Transactional(readOnly = true)
	public List<Ingredient> findAll() {
		return ingredientRepository.findAll();
	}

	@Transactional(readOnly = true)
	public Ingredient getById(UUID id) {
		return ingredientRepository.findById(id)
			.orElseThrow(() -> new IngredientNotFoundException(id));
	}

	@Transactional
	public Ingredient update(UUID id, CreateIngredientRequest request) {
		Ingredient ingredient = getById(id);
		requireOwner(ingredient.getCreatedBy());
		ingredient.update(
			request.name(), request.description(), request.region(),
			request.seasons() != null ? new HashSet<>(request.seasons()) : new HashSet<>(),
			request.substitutes(), request.provenanceStory(), request.country(),
			request.relatedTechniqueIds() != null ? new HashSet<>(request.relatedTechniqueIds()) : new HashSet<>()
		);
		return ingredientRepository.save(ingredient);
	}

	@Transactional
	public void delete(UUID id) {
		Ingredient ingredient = getById(id);
		requireOwner(ingredient.getCreatedBy());
		ingredientRepository.delete(ingredient);
	}

	@Transactional
	public Ingredient publish(UUID id) {
		Ingredient ingredient = getById(id);
		ingredient.publish();
		return ingredientRepository.save(ingredient);
	}

	@Transactional
	public Ingredient archive(UUID id) {
		Ingredient ingredient = getById(id);
		ingredient.archive();
		return ingredientRepository.save(ingredient);
	}

	private static void requireOwner(String createdBy) {
		if (!createdBy.equals(getCurrentUserId())) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the creator can modify this content");
		}
	}

	private static String getCurrentUserId() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth instanceof JwtAuthenticationToken jwtAuth) {
			String username = jwtAuth.getToken().getClaimAsString("preferred_username");
			if (username != null && !username.isBlank()) return username;
		}
		return "local-dev-user";
	}
}

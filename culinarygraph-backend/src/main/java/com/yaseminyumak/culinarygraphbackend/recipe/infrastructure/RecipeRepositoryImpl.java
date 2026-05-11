package com.yaseminyumak.culinarygraphbackend.recipe.infrastructure;

import com.yaseminyumak.culinarygraphbackend.recipe.domain.*;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class RecipeRepositoryImpl implements RecipeRepository {

	private final RecipeJpaRepository jpaRepository;

	public RecipeRepositoryImpl(RecipeJpaRepository jpaRepository) {
		this.jpaRepository = jpaRepository;
	}

	@Override
	public Recipe save(Recipe recipe) {
		RecipeEntity entity = toEntity(recipe);
		RecipeEntity saved = jpaRepository.save(entity);
		return toDomain(saved);
	}

	@Override
	public Optional<Recipe> findById(UUID id) {
		Optional<RecipeEntity> withSteps = jpaRepository.findByIdWithSteps(id);
		withSteps.ifPresent(e -> jpaRepository.findByIdWithIngredients(id));
		return withSteps.map(this::toDomain);
	}

	@Override
	public List<Recipe> findAll() {
		List<RecipeEntity> withSteps = jpaRepository.findAllWithSteps();
		if (!withSteps.isEmpty()) {
			jpaRepository.findAllWithIngredients(withSteps);
		}
		return withSteps.stream().map(this::toDomain).collect(Collectors.toList());
	}

	private RecipeEntity toEntity(Recipe recipe) {
		RecipeEntity e = new RecipeEntity();
		e.setId(recipe.getId());
		e.setTitle(recipe.getTitle());
		e.setDescription(recipe.getDescription());
		e.setDifficulty(recipe.getDifficulty());
		e.setDurationMinutes(recipe.getDurationMinutes());
		e.setStatus(recipe.getStatus());
		e.setCreatedBy(recipe.getCreatedBy());
		e.setCreatedAt(recipe.getCreatedAt());
		e.setUpdatedAt(recipe.getUpdatedAt());
		e.setCountry(recipe.getCountry());
		e.setTags(new java.util.ArrayList<>(recipe.getTags()));
		e.setOriginStory(recipe.getOriginStory());
		e.setAssociatedTechniqueIds(new java.util.HashSet<>(recipe.getAssociatedTechniqueIds()));
		e.setSpecialDays(new java.util.ArrayList<>(recipe.getSpecialDays()));
		int order = 0;
		for (RecipeStep step : recipe.getSteps()) {
			RecipeStepEntity se = new RecipeStepEntity(e, order++, step.getInstruction());
			e.getStepEntities().add(se);
		}
		for (RecipeIngredient ing : recipe.getIngredients()) {
			RecipeIngredientEntity ie = new RecipeIngredientEntity(e, ing.getName(), ing.getQuantity(), ing.getUnit(), ing.getIngredientId());
			e.getIngredientEntities().add(ie);
		}
		return e;
	}

	private Recipe toDomain(RecipeEntity e) {
		List<RecipeStep> steps = e.getStepEntities().stream()
			.map(se -> new RecipeStep(se.getStepOrder(), se.getInstruction()))
			.collect(Collectors.toList());
		List<RecipeIngredient> ingredients = e.getIngredientEntities().stream()
			.map(ie -> new RecipeIngredient(ie.getName(), ie.getQuantity(), ie.getUnit(), ie.getIngredientId()))
			.collect(Collectors.toList());
		return Recipe.fromPersistence(e.getId(), e.getTitle(), e.getDescription(), e.getDifficulty(),
			e.getDurationMinutes(), e.getStatus(), e.getCreatedBy(), e.getCreatedAt(), e.getUpdatedAt(), steps, ingredients,
			e.getCountry(), e.getTags(), e.getOriginStory(), e.getAssociatedTechniqueIds(), e.getSpecialDays());
	}

	@Override
	public void delete(Recipe recipe) {
		jpaRepository.deleteById(recipe.getId());
	}
}

package com.yaseminyumak.culinarygraphbackend.catalog.infrastructure;

import com.yaseminyumak.culinarygraphbackend.catalog.domain.Technique;
import com.yaseminyumak.culinarygraphbackend.catalog.domain.TechniqueRepository;
import com.yaseminyumak.culinarygraphbackend.catalog.domain.TechniqueStep;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class TechniqueRepositoryImpl implements TechniqueRepository {

	private final TechniqueJpaRepository jpaRepository;
	private final IngredientJpaRepository ingredientJpaRepository;

	public TechniqueRepositoryImpl(TechniqueJpaRepository jpaRepository,
	                               IngredientJpaRepository ingredientJpaRepository) {
		this.jpaRepository = jpaRepository;
		this.ingredientJpaRepository = ingredientJpaRepository;
	}

	@Override
	public Technique save(Technique technique) {
		TechniqueEntity entity = toEntity(technique);
		TechniqueEntity saved = jpaRepository.save(entity);
		return toDomain(saved);
	}

	@Override
	public Optional<Technique> findById(UUID id) {
		Optional<TechniqueEntity> withSteps = jpaRepository.findByIdWithSteps(id);
		withSteps.ifPresent(e -> jpaRepository.findByIdWithIngredients(id));
		return withSteps.map(this::toDomain);
	}

	@Override
	public List<Technique> findAll() {
		List<TechniqueEntity> withSteps = jpaRepository.findAllWithSteps();
		if (!withSteps.isEmpty()) {
			jpaRepository.findAllWithIngredients(withSteps);
		}
		return withSteps.stream().map(this::toDomain).collect(Collectors.toList());
	}

	private TechniqueEntity toEntity(Technique technique) {
		TechniqueEntity e = new TechniqueEntity();
		e.setId(technique.getId());
		e.setName(technique.getName());
		e.setDescription(technique.getDescription());
		e.setRegion(technique.getRegion());
		e.setDifficulty(technique.getDifficulty());
		e.setCountry(technique.getCountry());
		e.setCulturalNotes(technique.getCulturalNotes());
		e.setPrerequisites(technique.getPrerequisites());
		e.setRelatedTechniqueNames(new ArrayList<>(technique.getRelatedTechniqueNames()));
		e.setRelatedIngredientNames(new ArrayList<>(technique.getRelatedIngredientNames()));
		e.setStatus(technique.getStatus());
		e.setCreatedBy(technique.getCreatedBy());
		e.setCreatedAt(technique.getCreatedAt());
		e.setUpdatedAt(technique.getUpdatedAt());
		for (TechniqueStep step : technique.getSteps()) {
			TechniqueStepEntity se = new TechniqueStepEntity(e, step.getOrder(), step.getInstruction());
			e.getStepEntities().add(se);
		}
		Set<IngredientEntity> ingredientEntities = new HashSet<>();
		for (UUID ingredientId : technique.getIngredientIds()) {
			ingredientJpaRepository.findById(ingredientId).ifPresent(ingredientEntities::add);
		}
		e.setIngredientEntities(ingredientEntities);
		return e;
	}

	private Technique toDomain(TechniqueEntity e) {
		List<TechniqueStep> steps = e.getStepEntities().stream()
			.map(se -> new TechniqueStep(se.getStepOrder(), se.getInstruction()))
			.collect(Collectors.toList());
		Set<UUID> ingredientIds = e.getIngredientEntities().stream()
			.map(IngredientEntity::getId)
			.collect(Collectors.toSet());
		return Technique.fromPersistence(
			e.getId(), e.getName(), e.getDescription(), e.getRegion(),
			e.getDifficulty(), steps, ingredientIds, e.getCountry(),
			e.getCulturalNotes(), e.getPrerequisites(),
			e.getRelatedTechniqueNames(), e.getRelatedIngredientNames(),
			e.getStatus(), e.getCreatedBy(), e.getCreatedAt(), e.getUpdatedAt()
		);
	}
}

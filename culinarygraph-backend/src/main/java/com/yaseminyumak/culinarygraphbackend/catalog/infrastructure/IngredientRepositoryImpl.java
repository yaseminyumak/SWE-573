package com.yaseminyumak.culinarygraphbackend.catalog.infrastructure;

import com.yaseminyumak.culinarygraphbackend.catalog.domain.Ingredient;
import com.yaseminyumak.culinarygraphbackend.catalog.domain.IngredientRepository;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class IngredientRepositoryImpl implements IngredientRepository {

	private final IngredientJpaRepository jpaRepository;
	private final TechniqueJpaRepository techniqueJpaRepository;

	public IngredientRepositoryImpl(IngredientJpaRepository jpaRepository,
	                                TechniqueJpaRepository techniqueJpaRepository) {
		this.jpaRepository = jpaRepository;
		this.techniqueJpaRepository = techniqueJpaRepository;
	}

	@Override
	public Ingredient save(Ingredient ingredient) {
		IngredientEntity entity = toEntity(ingredient);
		IngredientEntity saved = jpaRepository.save(entity);
		return toDomain(saved);
	}

	@Override
	public Optional<Ingredient> findById(UUID id) {
		return jpaRepository.findByIdWithDetails(id).map(this::toDomain);
	}

	@Override
	public List<Ingredient> findAll() {
		return jpaRepository.findAllWithDetails().stream()
			.map(this::toDomain)
			.collect(Collectors.toList());
	}

	private IngredientEntity toEntity(Ingredient ingredient) {
		IngredientEntity e = new IngredientEntity();
		e.setId(ingredient.getId());
		e.setName(ingredient.getName());
		e.setDescription(ingredient.getDescription());
		e.setRegion(ingredient.getRegion());
		e.setSeasons(new java.util.HashSet<>(ingredient.getSeasons()));
		e.setSubstitutes(new java.util.ArrayList<>(ingredient.getSubstitutes()));
		e.setProvenanceStory(ingredient.getProvenanceStory());
		e.setCountry(ingredient.getCountry());
		Set<TechniqueEntity> relatedTechniques = new HashSet<>();
		for (UUID tid : ingredient.getRelatedTechniqueIds()) {
			techniqueJpaRepository.findById(tid).ifPresent(relatedTechniques::add);
		}
		e.setRelatedTechniques(relatedTechniques);
		e.setStatus(ingredient.getStatus());
		e.setCreatedBy(ingredient.getCreatedBy());
		e.setCreatedAt(ingredient.getCreatedAt());
		e.setUpdatedAt(ingredient.getUpdatedAt());
		return e;
	}

	private Ingredient toDomain(IngredientEntity e) {
		Set<UUID> relatedTechniqueIds = e.getRelatedTechniques().stream()
			.map(TechniqueEntity::getId)
			.collect(Collectors.toSet());
		return Ingredient.fromPersistence(
			e.getId(), e.getName(), e.getDescription(), e.getRegion(),
			e.getSeasons(), e.getSubstitutes(), e.getProvenanceStory(),
			e.getCountry(), relatedTechniqueIds,
			e.getStatus(), e.getCreatedBy(), e.getCreatedAt(), e.getUpdatedAt()
		);
	}

	@Override
	public void delete(Ingredient ingredient) {
		jpaRepository.deleteById(ingredient.getId());
	}
}

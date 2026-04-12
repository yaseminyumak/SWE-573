package com.yaseminyumak.culinarygraphbackend.catalog.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TechniqueJpaRepository extends JpaRepository<TechniqueEntity, UUID> {

	@Query("select t from TechniqueEntity t left join fetch t.stepEntities order by t.createdAt desc")
	List<TechniqueEntity> findAllWithSteps();

	@Query("select t from TechniqueEntity t left join fetch t.ingredientEntities where t in :techniques")
	List<TechniqueEntity> findAllWithIngredients(@Param("techniques") List<TechniqueEntity> techniques);

	@Query("select t from TechniqueEntity t left join fetch t.stepEntities where t.id = :id")
	Optional<TechniqueEntity> findByIdWithSteps(@Param("id") UUID id);

	@Query("select t from TechniqueEntity t left join fetch t.ingredientEntities where t.id = :id")
	Optional<TechniqueEntity> findByIdWithIngredients(@Param("id") UUID id);
}

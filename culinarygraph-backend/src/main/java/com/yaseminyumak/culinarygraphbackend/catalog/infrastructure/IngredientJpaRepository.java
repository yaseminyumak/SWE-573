package com.yaseminyumak.culinarygraphbackend.catalog.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IngredientJpaRepository extends JpaRepository<IngredientEntity, UUID> {

	@Query("select i from IngredientEntity i left join fetch i.seasons left join fetch i.substitutes order by i.createdAt desc")
	List<IngredientEntity> findAllWithDetails();

	@Query("select i from IngredientEntity i left join fetch i.seasons left join fetch i.substitutes where i.id = :id")
	Optional<IngredientEntity> findByIdWithDetails(UUID id);
}

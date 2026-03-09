package com.yaseminyumak.culinarygraphbackend.recipe.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RecipeJpaRepository extends JpaRepository<RecipeEntity, UUID> {

	@Query("select r from RecipeEntity r left join fetch r.stepEntities order by r.createdAt desc")
	List<RecipeEntity> findAllWithSteps();

	@Query("select r from RecipeEntity r left join fetch r.ingredientEntities where r in :recipes")
	List<RecipeEntity> findAllWithIngredients(@Param("recipes") List<RecipeEntity> recipes);

	@Query("select r from RecipeEntity r left join fetch r.stepEntities where r.id = :id")
	Optional<RecipeEntity> findByIdWithSteps(@Param("id") UUID id);

	@Query("select r from RecipeEntity r left join fetch r.ingredientEntities where r.id = :id")
	Optional<RecipeEntity> findByIdWithIngredients(@Param("id") UUID id);
}

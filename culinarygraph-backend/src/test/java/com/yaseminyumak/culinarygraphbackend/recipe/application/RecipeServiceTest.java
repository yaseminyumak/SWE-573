package com.yaseminyumak.culinarygraphbackend.recipe.application;

import com.yaseminyumak.culinarygraphbackend.recipe.api.dto.CreateRecipeRequest;
import com.yaseminyumak.culinarygraphbackend.recipe.domain.DifficultyLevel;
import com.yaseminyumak.culinarygraphbackend.recipe.domain.PublishStatus;
import com.yaseminyumak.culinarygraphbackend.recipe.domain.Recipe;
import com.yaseminyumak.culinarygraphbackend.recipe.domain.RecipeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RecipeServiceTest {

    @Mock
    RecipeRepository recipeRepository;

    @InjectMocks
    RecipeService recipeService;

    private Recipe sampleRecipe(PublishStatus status) {
        return Recipe.fromPersistence(
                UUID.randomUUID(), "Pasta", "desc", DifficultyLevel.EASY,
                30, status, "local-dev-user",
                Instant.now(), Instant.now(),
                List.of(), List.of(), "Italy", List.of("quick"), null, Set.of(), null, null
        );
    }

    private CreateRecipeRequest sampleRequest() {
        return new CreateRecipeRequest(
                "Pasta Carbonara", "Classic Roman pasta",
                DifficultyLevel.MEDIUM, 30,
                List.of(new CreateRecipeRequest.StepInput(1, "Boil water")),
                List.of(new CreateRecipeRequest.IngredientInput("Pasta", "200", "g", null)),
                "Italy", List.of("Italian"), "Roman origin",
                Set.of(), null, null
        );
    }

    @Test
    void create_savesAndReturnsRecipe() {
        Recipe saved = sampleRecipe(PublishStatus.PUBLISHED);
        when(recipeRepository.save(any())).thenReturn(saved);

        Recipe result = recipeService.create(sampleRequest());

        assertThat(result).isEqualTo(saved);
        verify(recipeRepository).save(any(Recipe.class));
    }

    @Test
    void create_withNullAssociatedTechniques_usesEmptySet() {
        CreateRecipeRequest req = new CreateRecipeRequest(
                "Pasta", null, null, null,
                List.of(new CreateRecipeRequest.StepInput(1, "Cook")),
                List.of(new CreateRecipeRequest.IngredientInput("Pasta", "200", "g", null)),
                null, null, null, null, null, null
        );
        Recipe saved = sampleRecipe(PublishStatus.PUBLISHED);
        when(recipeRepository.save(any())).thenReturn(saved);

        recipeService.create(req);

        verify(recipeRepository).save(any(Recipe.class));
    }

    @Test
    void findAll_returnsAllRecipes() {
        List<Recipe> recipes = List.of(
                sampleRecipe(PublishStatus.PUBLISHED),
                sampleRecipe(PublishStatus.PUBLISHED)
        );
        when(recipeRepository.findAll()).thenReturn(recipes);

        List<Recipe> result = recipeService.findAll();

        assertThat(result).hasSize(2);
    }

    @Test
    void getById_returnsRecipeWhenFound() {
        UUID id = UUID.randomUUID();
        Recipe recipe = sampleRecipe(PublishStatus.PUBLISHED);
        when(recipeRepository.findById(id)).thenReturn(Optional.of(recipe));

        Recipe result = recipeService.getById(id);

        assertThat(result).isEqualTo(recipe);
    }

    @Test
    void getById_throwsWhenNotFound() {
        UUID id = UUID.randomUUID();
        when(recipeRepository.findById(id)).thenReturn(Optional.empty());

        assertThatExceptionOfType(RecipeNotFoundException.class)
                .isThrownBy(() -> recipeService.getById(id));
    }

    @Test
    void update_savesUpdatedRecipe() {
        UUID id = UUID.randomUUID();
        Recipe existing = sampleRecipe(PublishStatus.PUBLISHED);
        when(recipeRepository.findById(id)).thenReturn(Optional.of(existing));
        when(recipeRepository.save(any())).thenReturn(existing);

        Recipe result = recipeService.update(id, sampleRequest());

        assertThat(result).isNotNull();
        verify(recipeRepository).save(existing);
    }

    @Test
    void update_throwsWhenRecipeNotFound() {
        UUID id = UUID.randomUUID();
        when(recipeRepository.findById(id)).thenReturn(Optional.empty());

        assertThatExceptionOfType(RecipeNotFoundException.class)
                .isThrownBy(() -> recipeService.update(id, sampleRequest()));
    }

    @Test
    void delete_deletesRecipe() {
        UUID id = UUID.randomUUID();
        Recipe recipe = sampleRecipe(PublishStatus.PUBLISHED);
        when(recipeRepository.findById(id)).thenReturn(Optional.of(recipe));

        recipeService.delete(id);

        verify(recipeRepository).delete(recipe);
    }

    @Test
    void delete_throwsWhenRecipeNotFound() {
        UUID id = UUID.randomUUID();
        when(recipeRepository.findById(id)).thenReturn(Optional.empty());

        assertThatExceptionOfType(RecipeNotFoundException.class)
                .isThrownBy(() -> recipeService.delete(id));
    }

    @Test
    void publish_publishesDraftRecipe() {
        UUID id = UUID.randomUUID();
        Recipe draft = sampleRecipe(PublishStatus.DRAFT);
        when(recipeRepository.findById(id)).thenReturn(Optional.of(draft));
        when(recipeRepository.save(any())).thenReturn(draft);

        Recipe result = recipeService.publish(id);

        assertThat(result.getStatus()).isEqualTo(PublishStatus.PUBLISHED);
        verify(recipeRepository).save(draft);
    }

    @Test
    void archive_archivesRecipe() {
        UUID id = UUID.randomUUID();
        Recipe recipe = sampleRecipe(PublishStatus.PUBLISHED);
        when(recipeRepository.findById(id)).thenReturn(Optional.of(recipe));
        when(recipeRepository.save(any())).thenReturn(recipe);

        Recipe result = recipeService.archive(id);

        assertThat(result.getStatus()).isEqualTo(PublishStatus.ARCHIVED);
        verify(recipeRepository).save(recipe);
    }
}

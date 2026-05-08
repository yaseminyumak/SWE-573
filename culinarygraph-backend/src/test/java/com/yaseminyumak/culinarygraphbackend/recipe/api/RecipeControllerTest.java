package com.yaseminyumak.culinarygraphbackend.recipe.api;

import tools.jackson.databind.ObjectMapper;
import com.yaseminyumak.culinarygraphbackend.recipe.api.dto.CreateRecipeRequest;
import com.yaseminyumak.culinarygraphbackend.recipe.application.RecipeNotFoundException;
import com.yaseminyumak.culinarygraphbackend.recipe.application.RecipeService;
import com.yaseminyumak.culinarygraphbackend.recipe.domain.DifficultyLevel;
import com.yaseminyumak.culinarygraphbackend.recipe.domain.PublishStatus;
import com.yaseminyumak.culinarygraphbackend.recipe.domain.Recipe;
import com.yaseminyumak.culinarygraphbackend.config.WebMvcTestSecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RecipeController.class)
@Import(WebMvcTestSecurityConfig.class)
class RecipeControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    RecipeService recipeService;

    @Autowired
    ObjectMapper objectMapper;

    private static final UUID RECIPE_ID = UUID.fromString("33333333-3333-3333-3333-333333333333");

    private Recipe sampleRecipe(PublishStatus status) {
        return Recipe.fromPersistence(
                RECIPE_ID, "Pasta Carbonara", "Classic Italian pasta",
                DifficultyLevel.MEDIUM, 30, status, "chef-1",
                Instant.now(), Instant.now(),
                List.of(), List.of(),
                "Italy", List.of("Italian", "Quick"), "Roman origin", Set.of()
        );
    }

    private CreateRecipeRequest sampleRequest() {
        return new CreateRecipeRequest(
                "Pasta Carbonara", "Classic Roman pasta",
                DifficultyLevel.MEDIUM, 30,
                List.of(new CreateRecipeRequest.StepInput(1, "Boil water")),
                List.of(new CreateRecipeRequest.IngredientInput("Pasta", "200", "g", null)),
                "Italy", List.of("Italian"), "Roman origin",
                Set.of()
        );
    }

    @Test
    void list_returnsOkWithRecipes() throws Exception {
        when(recipeService.findAll()).thenReturn(List.of(sampleRecipe(PublishStatus.PUBLISHED)));

        mockMvc.perform(get("/api/recipes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].title").value("Pasta Carbonara"));
    }

    @Test
    void list_returnsEmptyArrayWhenNoRecipes() throws Exception {
        when(recipeService.findAll()).thenReturn(List.of());

        mockMvc.perform(get("/api/recipes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void getById_returnsRecipeWhenFound() throws Exception {
        when(recipeService.getById(RECIPE_ID)).thenReturn(sampleRecipe(PublishStatus.PUBLISHED));

        mockMvc.perform(get("/api/recipes/{id}", RECIPE_ID))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Pasta Carbonara"))
                .andExpect(jsonPath("$.status").value("PUBLISHED"))
                .andExpect(jsonPath("$.country").value("Italy"));
    }

    @Test
    void getById_returns404WhenNotFound() throws Exception {
        UUID id = UUID.randomUUID();
        when(recipeService.getById(id)).thenThrow(new RecipeNotFoundException(id));

        mockMvc.perform(get("/api/recipes/{id}", id))
                .andExpect(status().isNotFound());
    }

    @Test
    void create_returnsCreatedWithRecipe() throws Exception {
        when(recipeService.create(any())).thenReturn(sampleRecipe(PublishStatus.PUBLISHED));

        mockMvc.perform(post("/api/recipes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleRequest())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Pasta Carbonara"));
    }

    @Test
    void create_returns400WhenTitleIsBlank() throws Exception {
        CreateRecipeRequest request = new CreateRecipeRequest(
                "", null, null, null,
                List.of(), List.of(), null, null, null, null
        );

        mockMvc.perform(post("/api/recipes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void create_returns400WhenStepsIsNull() throws Exception {
        CreateRecipeRequest request = new CreateRecipeRequest(
                "Pasta", null, null, null,
                null,
                List.of(new CreateRecipeRequest.IngredientInput("Pasta", "200", "g", null)),
                null, null, null, null
        );

        mockMvc.perform(post("/api/recipes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void update_returnsUpdatedRecipe() throws Exception {
        when(recipeService.update(eq(RECIPE_ID), any())).thenReturn(sampleRecipe(PublishStatus.PUBLISHED));

        mockMvc.perform(put("/api/recipes/{id}", RECIPE_ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleRequest())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Pasta Carbonara"));
    }

    @Test
    void update_returns404WhenNotFound() throws Exception {
        UUID id = UUID.randomUUID();
        when(recipeService.update(eq(id), any())).thenThrow(new RecipeNotFoundException(id));

        mockMvc.perform(put("/api/recipes/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleRequest())))
                .andExpect(status().isNotFound());
    }

    @Test
    void delete_returnsNoContent() throws Exception {
        doNothing().when(recipeService).delete(RECIPE_ID);

        mockMvc.perform(delete("/api/recipes/{id}", RECIPE_ID))
                .andExpect(status().isNoContent());
    }

    @Test
    void delete_returns404WhenNotFound() throws Exception {
        UUID id = UUID.randomUUID();
        doThrow(new RecipeNotFoundException(id)).when(recipeService).delete(id);

        mockMvc.perform(delete("/api/recipes/{id}", id))
                .andExpect(status().isNotFound());
    }

    @Test
    void archive_returnsArchivedRecipe() throws Exception {
        Recipe archived = Recipe.fromPersistence(
                RECIPE_ID, "Pasta Carbonara", "desc",
                DifficultyLevel.MEDIUM, 30, PublishStatus.ARCHIVED, "chef-1",
                Instant.now(), Instant.now(),
                List.of(), List.of(), "Italy", List.of(), null, Set.of()
        );
        when(recipeService.archive(RECIPE_ID)).thenReturn(archived);

        mockMvc.perform(put("/api/recipes/{id}/archive", RECIPE_ID))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ARCHIVED"));
    }
}

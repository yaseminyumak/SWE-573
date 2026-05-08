package com.yaseminyumak.culinarygraphbackend.catalog.api;

import tools.jackson.databind.ObjectMapper;
import com.yaseminyumak.culinarygraphbackend.catalog.api.dto.CreateIngredientRequest;
import com.yaseminyumak.culinarygraphbackend.catalog.application.IngredientNotFoundException;
import com.yaseminyumak.culinarygraphbackend.catalog.application.IngredientService;
import com.yaseminyumak.culinarygraphbackend.catalog.domain.Ingredient;
import com.yaseminyumak.culinarygraphbackend.catalog.domain.PublishStatus;
import com.yaseminyumak.culinarygraphbackend.catalog.domain.Season;
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

@WebMvcTest(IngredientController.class)
@Import(WebMvcTestSecurityConfig.class)
class IngredientControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    IngredientService ingredientService;

    @Autowired
    ObjectMapper objectMapper;

    private Ingredient sampleIngredient() {
        return Ingredient.fromPersistence(
                UUID.fromString("11111111-1111-1111-1111-111111111111"),
                "Saffron", "A spice", "Middle East",
                Set.of(Season.SPRING), List.of("turmeric"),
                "story", "Iran", Set.of(),
                PublishStatus.PUBLISHED, "user-1", Instant.now(), Instant.now()
        );
    }

    @Test
    void list_returnsOkWithIngredients() throws Exception {
        when(ingredientService.findAll()).thenReturn(List.of(sampleIngredient()));

        mockMvc.perform(get("/api/catalog/ingredients"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].name").value("Saffron"));
    }

    @Test
    void list_returnsEmptyArrayWhenNoIngredients() throws Exception {
        when(ingredientService.findAll()).thenReturn(List.of());

        mockMvc.perform(get("/api/catalog/ingredients"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void getById_returnsIngredientWhenFound() throws Exception {
        UUID id = UUID.fromString("11111111-1111-1111-1111-111111111111");
        when(ingredientService.getById(id)).thenReturn(sampleIngredient());

        mockMvc.perform(get("/api/catalog/ingredients/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Saffron"))
                .andExpect(jsonPath("$.status").value("PUBLISHED"));
    }

    @Test
    void getById_returns404WhenNotFound() throws Exception {
        UUID id = UUID.randomUUID();
        when(ingredientService.getById(id)).thenThrow(new IngredientNotFoundException(id));

        mockMvc.perform(get("/api/catalog/ingredients/{id}", id))
                .andExpect(status().isNotFound());
    }

    @Test
    void create_returnsCreatedWithIngredient() throws Exception {
        CreateIngredientRequest request = new CreateIngredientRequest(
                "Saffron", "A spice", "Middle East",
                List.of(Season.SPRING), List.of("turmeric"),
                "story", "Iran", Set.of()
        );
        when(ingredientService.create(any())).thenReturn(sampleIngredient());

        mockMvc.perform(post("/api/catalog/ingredients")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Saffron"));
    }

    @Test
    void create_returns400WhenNameIsBlank() throws Exception {
        CreateIngredientRequest request = new CreateIngredientRequest(
                "", "A spice", null, null, null, null, null, null
        );

        mockMvc.perform(post("/api/catalog/ingredients")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void update_returnsUpdatedIngredient() throws Exception {
        UUID id = UUID.fromString("11111111-1111-1111-1111-111111111111");
        CreateIngredientRequest request = new CreateIngredientRequest(
                "Saffron Updated", "New desc", "Asia",
                null, null, null, null, null
        );
        when(ingredientService.update(eq(id), any())).thenReturn(sampleIngredient());

        mockMvc.perform(put("/api/catalog/ingredients/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Saffron"));
    }

    @Test
    void delete_returnsNoContent() throws Exception {
        UUID id = UUID.fromString("11111111-1111-1111-1111-111111111111");
        doNothing().when(ingredientService).delete(id);

        mockMvc.perform(delete("/api/catalog/ingredients/{id}", id))
                .andExpect(status().isNoContent());
    }

    @Test
    void delete_returns404WhenNotFound() throws Exception {
        UUID id = UUID.randomUUID();
        doThrow(new IngredientNotFoundException(id)).when(ingredientService).delete(id);

        mockMvc.perform(delete("/api/catalog/ingredients/{id}", id))
                .andExpect(status().isNotFound());
    }

    @Test
    void archive_returnsArchivedIngredient() throws Exception {
        UUID id = UUID.fromString("11111111-1111-1111-1111-111111111111");
        Ingredient archived = Ingredient.fromPersistence(
                id, "Saffron", "desc", null, null, null, null, null, null,
                PublishStatus.ARCHIVED, "user-1", Instant.now(), Instant.now()
        );
        when(ingredientService.archive(id)).thenReturn(archived);

        mockMvc.perform(put("/api/catalog/ingredients/{id}/archive", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ARCHIVED"));
    }
}

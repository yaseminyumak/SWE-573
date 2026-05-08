package com.yaseminyumak.culinarygraphbackend.catalog.api;

import tools.jackson.databind.ObjectMapper;
import com.yaseminyumak.culinarygraphbackend.catalog.api.dto.CreateTechniqueRequest;
import com.yaseminyumak.culinarygraphbackend.catalog.application.TechniqueNotFoundException;
import com.yaseminyumak.culinarygraphbackend.catalog.application.TechniqueService;
import com.yaseminyumak.culinarygraphbackend.catalog.domain.DifficultyLevel;
import com.yaseminyumak.culinarygraphbackend.catalog.domain.PublishStatus;
import com.yaseminyumak.culinarygraphbackend.catalog.domain.Technique;
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

@WebMvcTest(TechniqueController.class)
@Import(WebMvcTestSecurityConfig.class)
class TechniqueControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    TechniqueService techniqueService;

    @Autowired
    ObjectMapper objectMapper;

    private static final UUID TECHNIQUE_ID = UUID.fromString("22222222-2222-2222-2222-222222222222");

    private Technique sampleTechnique(PublishStatus status) {
        return Technique.fromPersistence(
                TECHNIQUE_ID, "Blanching", "Briefly boil then cool", "Europe",
                DifficultyLevel.EASY, List.of(), Set.of(),
                "France", "notes", "prereqs", Set.of(),
                status, "chef-1", Instant.now(), Instant.now()
        );
    }

    @Test
    void list_returnsOkWithTechniques() throws Exception {
        when(techniqueService.findAll()).thenReturn(List.of(sampleTechnique(PublishStatus.PUBLISHED)));

        mockMvc.perform(get("/api/catalog/techniques"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].name").value("Blanching"));
    }

    @Test
    void getById_returnsTechniqueWhenFound() throws Exception {
        when(techniqueService.getById(TECHNIQUE_ID)).thenReturn(sampleTechnique(PublishStatus.PUBLISHED));

        mockMvc.perform(get("/api/catalog/techniques/{id}", TECHNIQUE_ID))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Blanching"))
                .andExpect(jsonPath("$.difficulty").value("EASY"));
    }

    @Test
    void getById_returns404WhenNotFound() throws Exception {
        UUID id = UUID.randomUUID();
        when(techniqueService.getById(id)).thenThrow(new TechniqueNotFoundException(id));

        mockMvc.perform(get("/api/catalog/techniques/{id}", id))
                .andExpect(status().isNotFound());
    }

    @Test
    void create_returnsCreatedWithTechnique() throws Exception {
        CreateTechniqueRequest request = new CreateTechniqueRequest(
                "Blanching", "Briefly boil", "Europe",
                DifficultyLevel.EASY,
                List.of(new CreateTechniqueRequest.StepInput(1, "Boil water")),
                List.of(), "France", "notes", "prereqs", Set.of()
        );
        when(techniqueService.create(any())).thenReturn(sampleTechnique(PublishStatus.PUBLISHED));

        mockMvc.perform(post("/api/catalog/techniques")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Blanching"));
    }

    @Test
    void create_returns400WhenNameIsBlank() throws Exception {
        CreateTechniqueRequest request = new CreateTechniqueRequest(
                "", null, null, null, null, null, null, null, null, null
        );

        mockMvc.perform(post("/api/catalog/techniques")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void update_returnsUpdatedTechnique() throws Exception {
        CreateTechniqueRequest request = new CreateTechniqueRequest(
                "Roasting", "Cook in oven", "Americas",
                DifficultyLevel.MEDIUM, List.of(), List.of(), "USA", null, null, Set.of()
        );
        when(techniqueService.update(eq(TECHNIQUE_ID), any())).thenReturn(sampleTechnique(PublishStatus.PUBLISHED));

        mockMvc.perform(put("/api/catalog/techniques/{id}", TECHNIQUE_ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void delete_returnsNoContent() throws Exception {
        doNothing().when(techniqueService).delete(TECHNIQUE_ID);

        mockMvc.perform(delete("/api/catalog/techniques/{id}", TECHNIQUE_ID))
                .andExpect(status().isNoContent());
    }

    @Test
    void delete_returns404WhenNotFound() throws Exception {
        UUID id = UUID.randomUUID();
        doThrow(new TechniqueNotFoundException(id)).when(techniqueService).delete(id);

        mockMvc.perform(delete("/api/catalog/techniques/{id}", id))
                .andExpect(status().isNotFound());
    }

    @Test
    void archive_returnsArchivedTechnique() throws Exception {
        Technique archived = Technique.fromPersistence(
                TECHNIQUE_ID, "Blanching", "desc", null,
                DifficultyLevel.EASY, List.of(), Set.of(),
                null, null, null, Set.of(),
                PublishStatus.ARCHIVED, "chef-1", Instant.now(), Instant.now()
        );
        when(techniqueService.archive(TECHNIQUE_ID)).thenReturn(archived);

        mockMvc.perform(put("/api/catalog/techniques/{id}/archive", TECHNIQUE_ID))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ARCHIVED"));
    }
}

package com.yaseminyumak.culinarygraphbackend.catalog.application;

import com.yaseminyumak.culinarygraphbackend.catalog.api.dto.CreateTechniqueRequest;
import com.yaseminyumak.culinarygraphbackend.catalog.domain.DifficultyLevel;
import com.yaseminyumak.culinarygraphbackend.catalog.domain.PublishStatus;
import com.yaseminyumak.culinarygraphbackend.catalog.domain.Technique;
import com.yaseminyumak.culinarygraphbackend.catalog.domain.TechniqueRepository;
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
class TechniqueServiceTest {

    @Mock
    TechniqueRepository techniqueRepository;

    @InjectMocks
    TechniqueService techniqueService;

    private Technique sampleTechnique(PublishStatus status) {
        return Technique.fromPersistence(
                UUID.randomUUID(), "Blanching", "Briefly boil", "Europe",
                DifficultyLevel.EASY, List.of(), Set.of(),
                "France", "notes", "prereqs", Set.of(),
                status, "local-dev-user", Instant.now(), Instant.now()
        );
    }

    private CreateTechniqueRequest sampleRequest() {
        return new CreateTechniqueRequest(
                "Blanching", "Briefly boil", "Europe",
                DifficultyLevel.EASY,
                List.of(new CreateTechniqueRequest.StepInput(1, "Boil water")),
                List.of(UUID.randomUUID()),
                "France", "notes", "prereqs", Set.of()
        );
    }

    @Test
    void create_savesAndReturnsTechnique() {
        Technique saved = sampleTechnique(PublishStatus.PUBLISHED);
        when(techniqueRepository.save(any())).thenReturn(saved);

        Technique result = techniqueService.create(sampleRequest());

        assertThat(result).isEqualTo(saved);
        verify(techniqueRepository).save(any(Technique.class));
    }

    @Test
    void create_withNullSteps_usesEmptyList() {
        CreateTechniqueRequest req = new CreateTechniqueRequest(
                "Blanching", null, null, null, null, null, null, null, null, null
        );
        Technique saved = sampleTechnique(PublishStatus.PUBLISHED);
        when(techniqueRepository.save(any())).thenReturn(saved);

        techniqueService.create(req);

        verify(techniqueRepository).save(any(Technique.class));
    }

    @Test
    void findAll_returnsAllTechniques() {
        List<Technique> techniques = List.of(
                sampleTechnique(PublishStatus.PUBLISHED),
                sampleTechnique(PublishStatus.PUBLISHED)
        );
        when(techniqueRepository.findAll()).thenReturn(techniques);

        List<Technique> result = techniqueService.findAll();

        assertThat(result).hasSize(2);
    }

    @Test
    void getById_returnsTechniqueWhenFound() {
        UUID id = UUID.randomUUID();
        Technique technique = sampleTechnique(PublishStatus.PUBLISHED);
        when(techniqueRepository.findById(id)).thenReturn(Optional.of(technique));

        Technique result = techniqueService.getById(id);

        assertThat(result).isEqualTo(technique);
    }

    @Test
    void getById_throwsWhenNotFound() {
        UUID id = UUID.randomUUID();
        when(techniqueRepository.findById(id)).thenReturn(Optional.empty());

        assertThatExceptionOfType(TechniqueNotFoundException.class)
                .isThrownBy(() -> techniqueService.getById(id));
    }

    @Test
    void update_savesUpdatedTechnique() {
        UUID id = UUID.randomUUID();
        Technique existing = sampleTechnique(PublishStatus.PUBLISHED);
        when(techniqueRepository.findById(id)).thenReturn(Optional.of(existing));
        when(techniqueRepository.save(any())).thenReturn(existing);

        Technique result = techniqueService.update(id, sampleRequest());

        assertThat(result).isNotNull();
        verify(techniqueRepository).save(existing);
    }

    @Test
    void update_throwsWhenTechniqueNotFound() {
        UUID id = UUID.randomUUID();
        when(techniqueRepository.findById(id)).thenReturn(Optional.empty());

        assertThatExceptionOfType(TechniqueNotFoundException.class)
                .isThrownBy(() -> techniqueService.update(id, sampleRequest()));
    }

    @Test
    void delete_deletesTechnique() {
        UUID id = UUID.randomUUID();
        Technique technique = sampleTechnique(PublishStatus.PUBLISHED);
        when(techniqueRepository.findById(id)).thenReturn(Optional.of(technique));

        techniqueService.delete(id);

        verify(techniqueRepository).delete(technique);
    }

    @Test
    void delete_throwsWhenTechniqueNotFound() {
        UUID id = UUID.randomUUID();
        when(techniqueRepository.findById(id)).thenReturn(Optional.empty());

        assertThatExceptionOfType(TechniqueNotFoundException.class)
                .isThrownBy(() -> techniqueService.delete(id));
    }

    @Test
    void publish_publishesDraftTechnique() {
        UUID id = UUID.randomUUID();
        Technique draft = sampleTechnique(PublishStatus.DRAFT);
        when(techniqueRepository.findById(id)).thenReturn(Optional.of(draft));
        when(techniqueRepository.save(any())).thenReturn(draft);

        Technique result = techniqueService.publish(id);

        assertThat(result.getStatus()).isEqualTo(PublishStatus.PUBLISHED);
        verify(techniqueRepository).save(draft);
    }

    @Test
    void archive_archivesTechnique() {
        UUID id = UUID.randomUUID();
        Technique technique = sampleTechnique(PublishStatus.PUBLISHED);
        when(techniqueRepository.findById(id)).thenReturn(Optional.of(technique));
        when(techniqueRepository.save(any())).thenReturn(technique);

        Technique result = techniqueService.archive(id);

        assertThat(result.getStatus()).isEqualTo(PublishStatus.ARCHIVED);
        verify(techniqueRepository).save(technique);
    }
}

package com.yaseminyumak.culinarygraphbackend.catalog.application;

import com.yaseminyumak.culinarygraphbackend.catalog.api.dto.CreateIngredientRequest;
import com.yaseminyumak.culinarygraphbackend.catalog.domain.Ingredient;
import com.yaseminyumak.culinarygraphbackend.catalog.domain.IngredientRepository;
import com.yaseminyumak.culinarygraphbackend.catalog.domain.PublishStatus;
import com.yaseminyumak.culinarygraphbackend.catalog.domain.Season;
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
class IngredientServiceTest {

    @Mock
    IngredientRepository ingredientRepository;

    @InjectMocks
    IngredientService ingredientService;

    private Ingredient sampleIngredient(PublishStatus status) {
        return Ingredient.fromPersistence(
                UUID.randomUUID(), "Saffron", "A spice", "Middle East",
                Set.of(Season.SPRING), List.of("turmeric"),
                "story", "Iran", Set.of(),
                status, "user-1", Instant.now(), Instant.now()
        );
    }

    private CreateIngredientRequest sampleRequest() {
        return new CreateIngredientRequest(
                "Saffron", "A spice", "Middle East",
                List.of(Season.SPRING), List.of("turmeric"),
                "story", "Iran", Set.of()
        );
    }

    @Test
    void create_savesAndReturnsIngredient() {
        Ingredient saved = sampleIngredient(PublishStatus.PUBLISHED);
        when(ingredientRepository.save(any())).thenReturn(saved);

        Ingredient result = ingredientService.create(sampleRequest());

        assertThat(result).isEqualTo(saved);
        verify(ingredientRepository).save(any(Ingredient.class));
    }

    @Test
    void create_withNullSeasons_usesEmptySet() {
        CreateIngredientRequest req = new CreateIngredientRequest(
                "Salt", null, null, null, null, null, null, null
        );
        Ingredient saved = sampleIngredient(PublishStatus.PUBLISHED);
        when(ingredientRepository.save(any())).thenReturn(saved);

        ingredientService.create(req);

        verify(ingredientRepository).save(any(Ingredient.class));
    }

    @Test
    void findAll_returnsAllIngredients() {
        List<Ingredient> ingredients = List.of(
                sampleIngredient(PublishStatus.PUBLISHED),
                sampleIngredient(PublishStatus.PUBLISHED)
        );
        when(ingredientRepository.findAll()).thenReturn(ingredients);

        List<Ingredient> result = ingredientService.findAll();

        assertThat(result).hasSize(2);
    }

    @Test
    void getById_returnsIngredientWhenFound() {
        UUID id = UUID.randomUUID();
        Ingredient ingredient = sampleIngredient(PublishStatus.PUBLISHED);
        when(ingredientRepository.findById(id)).thenReturn(Optional.of(ingredient));

        Ingredient result = ingredientService.getById(id);

        assertThat(result).isEqualTo(ingredient);
    }

    @Test
    void getById_throwsWhenNotFound() {
        UUID id = UUID.randomUUID();
        when(ingredientRepository.findById(id)).thenReturn(Optional.empty());

        assertThatExceptionOfType(IngredientNotFoundException.class)
                .isThrownBy(() -> ingredientService.getById(id));
    }

    @Test
    void update_savesUpdatedIngredient() {
        UUID id = UUID.randomUUID();
        Ingredient existing = sampleIngredient(PublishStatus.PUBLISHED);
        when(ingredientRepository.findById(id)).thenReturn(Optional.of(existing));
        when(ingredientRepository.save(any())).thenReturn(existing);

        Ingredient result = ingredientService.update(id, sampleRequest());

        assertThat(result).isNotNull();
        verify(ingredientRepository).save(existing);
    }

    @Test
    void update_throwsWhenIngredientNotFound() {
        UUID id = UUID.randomUUID();
        when(ingredientRepository.findById(id)).thenReturn(Optional.empty());

        assertThatExceptionOfType(IngredientNotFoundException.class)
                .isThrownBy(() -> ingredientService.update(id, sampleRequest()));
    }

    @Test
    void delete_deletesIngredient() {
        UUID id = UUID.randomUUID();
        Ingredient ingredient = sampleIngredient(PublishStatus.PUBLISHED);
        when(ingredientRepository.findById(id)).thenReturn(Optional.of(ingredient));

        ingredientService.delete(id);

        verify(ingredientRepository).delete(ingredient);
    }

    @Test
    void delete_throwsWhenIngredientNotFound() {
        UUID id = UUID.randomUUID();
        when(ingredientRepository.findById(id)).thenReturn(Optional.empty());

        assertThatExceptionOfType(IngredientNotFoundException.class)
                .isThrownBy(() -> ingredientService.delete(id));
    }

    @Test
    void publish_publishesDraftIngredient() {
        UUID id = UUID.randomUUID();
        Ingredient draft = sampleIngredient(PublishStatus.DRAFT);
        when(ingredientRepository.findById(id)).thenReturn(Optional.of(draft));
        when(ingredientRepository.save(any())).thenReturn(draft);

        Ingredient result = ingredientService.publish(id);

        assertThat(result.getStatus()).isEqualTo(PublishStatus.PUBLISHED);
        verify(ingredientRepository).save(draft);
    }

    @Test
    void archive_archivesIngredient() {
        UUID id = UUID.randomUUID();
        Ingredient ingredient = sampleIngredient(PublishStatus.PUBLISHED);
        when(ingredientRepository.findById(id)).thenReturn(Optional.of(ingredient));
        when(ingredientRepository.save(any())).thenReturn(ingredient);

        Ingredient result = ingredientService.archive(id);

        assertThat(result.getStatus()).isEqualTo(PublishStatus.ARCHIVED);
        verify(ingredientRepository).save(ingredient);
    }
}

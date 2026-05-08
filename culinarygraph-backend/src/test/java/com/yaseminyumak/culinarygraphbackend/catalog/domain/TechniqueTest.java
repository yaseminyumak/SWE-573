package com.yaseminyumak.culinarygraphbackend.catalog.domain;

import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;

class TechniqueTest {

    private Technique defaultTechnique() {
        return Technique.create(
                "Blanching", "Briefly boil then cool", "European",
                DifficultyLevel.EASY,
                List.of(new TechniqueStep(1, "Boil water"), new TechniqueStep(2, "Dip and cool")),
                Set.of(UUID.randomUUID()),
                "France", "Classic prep technique", "Basic knife skills required",
                Set.of(), "user-1"
        );
    }

    @Test
    void create_setsAllFields() {
        UUID ingredientId = UUID.randomUUID();
        UUID relatedId = UUID.randomUUID();

        Technique t = Technique.create(
                "Blanching", "Desc", "Europe",
                DifficultyLevel.HARD,
                List.of(new TechniqueStep(1, "Step one")),
                Set.of(ingredientId),
                "France", "Notes", "Prerequisites",
                Set.of(relatedId), "chef-1"
        );

        assertThat(t.getId()).isNotNull();
        assertThat(t.getName()).isEqualTo("Blanching");
        assertThat(t.getDescription()).isEqualTo("Desc");
        assertThat(t.getRegion()).isEqualTo("Europe");
        assertThat(t.getDifficulty()).isEqualTo(DifficultyLevel.HARD);
        assertThat(t.getSteps()).hasSize(1);
        assertThat(t.getSteps().get(0).getInstruction()).isEqualTo("Step one");
        assertThat(t.getIngredientIds()).containsExactly(ingredientId);
        assertThat(t.getCountry()).isEqualTo("France");
        assertThat(t.getCulturalNotes()).isEqualTo("Notes");
        assertThat(t.getPrerequisites()).isEqualTo("Prerequisites");
        assertThat(t.getRelatedTechniqueIds()).containsExactly(relatedId);
        assertThat(t.getCreatedBy()).isEqualTo("chef-1");
    }

    @Test
    void create_initialStatusIsPublished() {
        assertThat(defaultTechnique().getStatus()).isEqualTo(PublishStatus.PUBLISHED);
    }

    @Test
    void create_defaultsDifficultyToMediumWhenNull() {
        Technique t = Technique.create("Blanching", null, null,
                null, null, null, null, null, null, null, "user-1");

        assertThat(t.getDifficulty()).isEqualTo(DifficultyLevel.MEDIUM);
    }

    @Test
    void create_trimsNameAndDescription() {
        Technique t = Technique.create("  Sautéing  ", "  desc  ", null,
                null, null, null, null, null, null, null, "user-1");

        assertThat(t.getName()).isEqualTo("Sautéing");
        assertThat(t.getDescription()).isEqualTo("desc");
    }

    @Test
    void create_throwsWhenNameIsNull() {
        assertThatNullPointerException()
                .isThrownBy(() -> Technique.create(null, null, null,
                        null, null, null, null, null, null, null, "user-1"));
    }

    @Test
    void create_throwsWhenCreatedByIsNull() {
        assertThatNullPointerException()
                .isThrownBy(() -> Technique.create("Blanching", null, null,
                        null, null, null, null, null, null, null, null));
    }

    @Test
    void update_replacesStepsAndIngredients() {
        Technique t = defaultTechnique();
        UUID newIngId = UUID.randomUUID();

        t.update("Roasting", "New desc", "Americas", DifficultyLevel.HARD,
                List.of(new TechniqueStep(1, "Preheat oven")),
                Set.of(newIngId),
                "USA", "New notes", "New prereqs", Set.of());

        assertThat(t.getName()).isEqualTo("Roasting");
        assertThat(t.getDifficulty()).isEqualTo(DifficultyLevel.HARD);
        assertThat(t.getSteps()).hasSize(1);
        assertThat(t.getSteps().get(0).getInstruction()).isEqualTo("Preheat oven");
        assertThat(t.getIngredientIds()).containsExactly(newIngId);
    }

    @Test
    void update_updatesTimestamp() throws InterruptedException {
        Technique t = defaultTechnique();
        Instant before = t.getUpdatedAt();
        Thread.sleep(5);

        t.update("Roasting", null, null, null, null, null, null, null, null, null);

        assertThat(t.getUpdatedAt()).isAfter(before);
    }

    @Test
    void archive_changesStatusToArchived() {
        Technique t = defaultTechnique();

        t.archive();

        assertThat(t.getStatus()).isEqualTo(PublishStatus.ARCHIVED);
    }

    @Test
    void archive_throwsWhenAlreadyArchived() {
        Technique t = defaultTechnique();
        t.archive();

        assertThatIllegalStateException()
                .isThrownBy(t::archive)
                .withMessageContaining("Already archived");
    }

    @Test
    void publish_throwsWhenNotDraft() {
        // create() yields PUBLISHED, so publish() should throw
        Technique t = defaultTechnique();

        assertThatIllegalStateException()
                .isThrownBy(t::publish)
                .withMessageContaining("Only DRAFT");
    }

    @Test
    void publish_succeedsWhenDraft() {
        Technique t = Technique.fromPersistence(
                UUID.randomUUID(), "Blanching", "desc", "Europe",
                DifficultyLevel.EASY, List.of(), Set.of(),
                "France", null, null, Set.of(),
                PublishStatus.DRAFT, "user-1", Instant.now(), Instant.now()
        );

        t.publish();

        assertThat(t.getStatus()).isEqualTo(PublishStatus.PUBLISHED);
    }

    @Test
    void stepsAreImmutableViaGetter() {
        Technique t = defaultTechnique();

        assertThatExceptionOfType(UnsupportedOperationException.class)
                .isThrownBy(() -> t.getSteps().add(new TechniqueStep(99, "hack")));
    }
}

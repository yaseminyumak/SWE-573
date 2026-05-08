package com.yaseminyumak.culinarygraphbackend.recipe.domain;

import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;

class RecipeTest {

    private Recipe defaultRecipe() {
        return Recipe.create(
                "Pasta Carbonara", "Classic Italian pasta",
                DifficultyLevel.MEDIUM, 30,
                "chef-1",
                List.of(new RecipeStep(1, "Boil water"), new RecipeStep(2, "Cook pasta")),
                List.of(new RecipeIngredient("Pasta", "200", "g", null)),
                "Italy", List.of("Italian", "Quick"), "Roman origin",
                Set.of()
        );
    }

    @Test
    void create_setsAllFields() {
        UUID techId = UUID.randomUUID();
        Recipe r = Recipe.create(
                "Pasta", "desc", DifficultyLevel.EASY, 20,
                "chef-1",
                List.of(new RecipeStep(1, "Cook")),
                List.of(new RecipeIngredient("Pasta", "200", "g", null)),
                "Italy", List.of("quick"), "story",
                Set.of(techId)
        );

        assertThat(r.getId()).isNotNull();
        assertThat(r.getTitle()).isEqualTo("Pasta");
        assertThat(r.getDescription()).isEqualTo("desc");
        assertThat(r.getDifficulty()).isEqualTo(DifficultyLevel.EASY);
        assertThat(r.getDurationMinutes()).isEqualTo(20);
        assertThat(r.getCreatedBy()).isEqualTo("chef-1");
        assertThat(r.getSteps()).hasSize(1);
        assertThat(r.getIngredients()).hasSize(1);
        assertThat(r.getCountry()).isEqualTo("Italy");
        assertThat(r.getTags()).containsExactly("quick");
        assertThat(r.getOriginStory()).isEqualTo("story");
        assertThat(r.getAssociatedTechniqueIds()).containsExactly(techId);
        assertThat(r.getCreatedAt()).isNotNull();
    }

    @Test
    void create_trimsTitleAndDescription() {
        Recipe r = Recipe.create("  Pasta  ", "  desc  ", null, null,
                "chef-1", List.of(), List.of(), null, null, null, null);

        assertThat(r.getTitle()).isEqualTo("Pasta");
        assertThat(r.getDescription()).isEqualTo("desc");
    }

    @Test
    void create_initialStatusIsPublished() {
        assertThat(defaultRecipe().getStatus()).isEqualTo(PublishStatus.PUBLISHED);
    }

    @Test
    void create_defaultsDifficultyToMediumWhenNull() {
        Recipe r = Recipe.create("Pasta", null, null, null,
                "chef-1", List.of(), List.of(), null, null, null, null);

        assertThat(r.getDifficulty()).isEqualTo(DifficultyLevel.MEDIUM);
    }

    @Test
    void create_negativeDurationIsStoredAsNull() {
        Recipe r = Recipe.create("Pasta", null, null, -5,
                "chef-1", List.of(), List.of(), null, null, null, null);

        assertThat(r.getDurationMinutes()).isNull();
    }

    @Test
    void create_throwsWhenTitleIsNull() {
        assertThatNullPointerException()
                .isThrownBy(() -> Recipe.create(null, null, null, null,
                        "chef-1", List.of(), List.of(), null, null, null, null));
    }

    @Test
    void create_throwsWhenCreatedByIsNull() {
        assertThatNullPointerException()
                .isThrownBy(() -> Recipe.create("Pasta", null, null, null,
                        null, List.of(), List.of(), null, null, null, null));
    }

    @Test
    void isPublished_returnsTrueWhenPublished() {
        assertThat(defaultRecipe().isPublished()).isTrue();
    }

    @Test
    void isPublished_returnsFalseAfterArchive() {
        Recipe r = defaultRecipe();
        r.archive();
        assertThat(r.isPublished()).isFalse();
    }

    @Test
    void update_changesAllMutableFields() {
        Recipe r = defaultRecipe();
        UUID techId = UUID.randomUUID();

        r.update("Risotto", "new desc", DifficultyLevel.HARD, 45,
                List.of(new RecipeStep(1, "Toast rice")),
                List.of(new RecipeIngredient("Rice", "300", "g", null)),
                "Italy", List.of("slow"), "northern Italy",
                Set.of(techId));

        assertThat(r.getTitle()).isEqualTo("Risotto");
        assertThat(r.getDescription()).isEqualTo("new desc");
        assertThat(r.getDifficulty()).isEqualTo(DifficultyLevel.HARD);
        assertThat(r.getDurationMinutes()).isEqualTo(45);
        assertThat(r.getSteps()).hasSize(1);
        assertThat(r.getIngredients()).hasSize(1);
        assertThat(r.getAssociatedTechniqueIds()).containsExactly(techId);
    }

    @Test
    void update_updatesTimestamp() throws InterruptedException {
        Recipe r = defaultRecipe();
        Instant before = r.getUpdatedAt();
        Thread.sleep(5);

        r.update("Risotto", null, null, null, List.of(), List.of(),
                null, null, null, null);

        assertThat(r.getUpdatedAt()).isAfter(before);
    }

    @Test
    void archive_changesStatusToArchived() {
        Recipe r = defaultRecipe();

        r.archive();

        assertThat(r.getStatus()).isEqualTo(PublishStatus.ARCHIVED);
    }

    @Test
    void archive_throwsWhenAlreadyArchived() {
        Recipe r = defaultRecipe();
        r.archive();

        assertThatIllegalStateException()
                .isThrownBy(r::archive)
                .withMessageContaining("Already archived");
    }

    @Test
    void publish_throwsWhenNotDraft() {
        // create() yields PUBLISHED, so publish() should throw
        Recipe r = defaultRecipe();

        assertThatIllegalStateException()
                .isThrownBy(r::publish)
                .withMessageContaining("Only DRAFT");
    }

    @Test
    void publish_succeedsWhenDraft() {
        Recipe r = Recipe.fromPersistence(
                UUID.randomUUID(), "Pasta", "desc", DifficultyLevel.EASY,
                30, PublishStatus.DRAFT, "chef-1",
                Instant.now(), Instant.now(),
                List.of(), List.of(), "Italy", List.of(), null, Set.of()
        );

        r.publish();

        assertThat(r.getStatus()).isEqualTo(PublishStatus.PUBLISHED);
    }

    @Test
    void stepsAreImmutableViaGetter() {
        Recipe r = defaultRecipe();

        assertThatExceptionOfType(UnsupportedOperationException.class)
                .isThrownBy(() -> r.getSteps().add(new RecipeStep(99, "hack")));
    }

    @Test
    void ingredientsAreImmutableViaGetter() {
        Recipe r = defaultRecipe();

        assertThatExceptionOfType(UnsupportedOperationException.class)
                .isThrownBy(() -> r.getIngredients().add(new RecipeIngredient("hack", null, null, null)));
    }
}

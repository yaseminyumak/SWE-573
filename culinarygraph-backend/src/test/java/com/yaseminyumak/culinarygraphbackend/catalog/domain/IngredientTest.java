package com.yaseminyumak.culinarygraphbackend.catalog.domain;

import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;

class IngredientTest {

    @Test
    void create_setsAllFields() {
        UUID techId = UUID.randomUUID();
        Ingredient ing = Ingredient.create(
                "Saffron", "A spice", "Middle East",
                Set.of(Season.SPRING), List.of("turmeric"),
                "Ancient spice", "Iran",
                Set.of(techId), "user-1"
        );

        assertThat(ing.getId()).isNotNull();
        assertThat(ing.getName()).isEqualTo("Saffron");
        assertThat(ing.getDescription()).isEqualTo("A spice");
        assertThat(ing.getRegion()).isEqualTo("Middle East");
        assertThat(ing.getSeasons()).containsExactly(Season.SPRING);
        assertThat(ing.getSubstitutes()).containsExactly("turmeric");
        assertThat(ing.getProvenanceStory()).isEqualTo("Ancient spice");
        assertThat(ing.getCountry()).isEqualTo("Iran");
        assertThat(ing.getRelatedTechniqueIds()).containsExactly(techId);
        assertThat(ing.getCreatedBy()).isEqualTo("user-1");
        assertThat(ing.getCreatedAt()).isNotNull();
        assertThat(ing.getUpdatedAt()).isNotNull();
    }

    @Test
    void create_trimsNameAndDescription() {
        Ingredient ing = Ingredient.create("  Saffron  ", "  desc  ", null,
                null, null, null, null, null, "user-1");

        assertThat(ing.getName()).isEqualTo("Saffron");
        assertThat(ing.getDescription()).isEqualTo("desc");
    }

    @Test
    void create_nullRegionDefaultsToEmpty() {
        Ingredient ing = Ingredient.create("Salt", null, null,
                null, null, null, null, null, "user-1");

        assertThat(ing.getRegion()).isEmpty();
        assertThat(ing.getDescription()).isEmpty();
    }

    @Test
    void create_initialStatusIsPublished() {
        Ingredient ing = Ingredient.create("Salt", null, null,
                null, null, null, null, null, "user-1");

        assertThat(ing.getStatus()).isEqualTo(PublishStatus.PUBLISHED);
    }

    @Test
    void create_throwsWhenNameIsNull() {
        assertThatNullPointerException()
                .isThrownBy(() -> Ingredient.create(null, null, null,
                        null, null, null, null, null, "user-1"));
    }

    @Test
    void create_throwsWhenCreatedByIsNull() {
        assertThatNullPointerException()
                .isThrownBy(() -> Ingredient.create("Salt", null, null,
                        null, null, null, null, null, null));
    }

    @Test
    void update_changesAllMutableFields() {
        Ingredient ing = Ingredient.create("Salt", "desc", "Asia",
                Set.of(Season.WINTER), List.of("sea salt"),
                "old story", "China", Set.of(), "user-1");
        UUID newTechId = UUID.randomUUID();

        ing.update("Sea Salt", "new desc", "Europe",
                Set.of(Season.SUMMER), List.of("rock salt"),
                "new story", "France", Set.of(newTechId));

        assertThat(ing.getName()).isEqualTo("Sea Salt");
        assertThat(ing.getDescription()).isEqualTo("new desc");
        assertThat(ing.getRegion()).isEqualTo("Europe");
        assertThat(ing.getSeasons()).containsExactly(Season.SUMMER);
        assertThat(ing.getSubstitutes()).containsExactly("rock salt");
        assertThat(ing.getProvenanceStory()).isEqualTo("new story");
        assertThat(ing.getCountry()).isEqualTo("France");
        assertThat(ing.getRelatedTechniqueIds()).containsExactly(newTechId);
    }

    @Test
    void update_updatesTimestamp() throws InterruptedException {
        Ingredient ing = Ingredient.create("Salt", null, null,
                null, null, null, null, null, "user-1");
        Instant before = ing.getUpdatedAt();
        Thread.sleep(5);

        ing.update("Sea Salt", null, null, null, null, null, null, null);

        assertThat(ing.getUpdatedAt()).isAfter(before);
    }

    @Test
    void archive_changesStatusToArchived() {
        Ingredient ing = Ingredient.create("Salt", null, null,
                null, null, null, null, null, "user-1");

        ing.archive();

        assertThat(ing.getStatus()).isEqualTo(PublishStatus.ARCHIVED);
    }

    @Test
    void archive_throwsWhenAlreadyArchived() {
        Ingredient ing = Ingredient.create("Salt", null, null,
                null, null, null, null, null, "user-1");
        ing.archive();

        assertThatIllegalStateException()
                .isThrownBy(ing::archive)
                .withMessageContaining("Already archived");
    }

    @Test
    void publish_throwsWhenNotDraft() {
        // create() produces PUBLISHED, so publish() should throw
        Ingredient ing = Ingredient.create("Salt", null, null,
                null, null, null, null, null, "user-1");

        assertThatIllegalStateException()
                .isThrownBy(ing::publish)
                .withMessageContaining("Only DRAFT");
    }

    @Test
    void publish_succeedsWhenDraft() {
        Ingredient ing = Ingredient.fromPersistence(
                UUID.randomUUID(), "Salt", null, null,
                null, null, null, null, null,
                PublishStatus.DRAFT, "user-1", Instant.now(), Instant.now()
        );

        ing.publish();

        assertThat(ing.getStatus()).isEqualTo(PublishStatus.PUBLISHED);
    }

    @Test
    void fromPersistence_restoresAllFields() {
        UUID id = UUID.randomUUID();
        UUID techId = UUID.randomUUID();
        Instant createdAt = Instant.now().minusSeconds(60);
        Instant updatedAt = Instant.now();

        Ingredient ing = Ingredient.fromPersistence(
                id, "Saffron", "A spice", "Iran",
                Set.of(Season.YEAR_ROUND), List.of("turmeric"),
                "story", "Iran", Set.of(techId),
                PublishStatus.ARCHIVED, "user-1", createdAt, updatedAt
        );

        assertThat(ing.getId()).isEqualTo(id);
        assertThat(ing.getStatus()).isEqualTo(PublishStatus.ARCHIVED);
        assertThat(ing.getCreatedAt()).isEqualTo(createdAt);
        assertThat(ing.getUpdatedAt()).isEqualTo(updatedAt);
    }
}

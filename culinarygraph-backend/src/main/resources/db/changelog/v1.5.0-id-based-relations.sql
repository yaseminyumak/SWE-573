--liquibase formatted sql

--changeset culinarygraph:6

-- Drop old name-based relation tables
DROP TABLE IF EXISTS ingredient_related_techniques;
DROP TABLE IF EXISTS technique_related_techniques;
DROP TABLE IF EXISTS technique_related_ingredient_names;
DROP TABLE IF EXISTS recipe_associated_techniques;

-- ingredient <-> technique (ingredient says "I am used in these techniques")
CREATE TABLE ingredient_related_techniques (
    ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
    technique_id  UUID NOT NULL REFERENCES techniques(id)  ON DELETE CASCADE,
    PRIMARY KEY (ingredient_id, technique_id)
);

-- technique <-> technique (self-referential related techniques)
CREATE TABLE technique_related_techniques (
    technique_id         UUID NOT NULL REFERENCES techniques(id) ON DELETE CASCADE,
    related_technique_id UUID NOT NULL REFERENCES techniques(id) ON DELETE CASCADE,
    PRIMARY KEY (technique_id, related_technique_id)
);

-- recipe <-> technique
CREATE TABLE recipe_associated_techniques (
    recipe_id    UUID NOT NULL REFERENCES recipes(id)    ON DELETE CASCADE,
    technique_id UUID NOT NULL REFERENCES techniques(id) ON DELETE CASCADE,
    PRIMARY KEY (recipe_id, technique_id)
);

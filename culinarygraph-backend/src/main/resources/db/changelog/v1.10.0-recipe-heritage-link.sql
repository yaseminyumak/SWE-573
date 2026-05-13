--liquibase formatted sql

--changeset yaseminyumak:v1.10.0-recipe-heritage-link
CREATE TABLE recipe_heritage_ids (
    recipe_id  UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    heritage_id UUID NOT NULL REFERENCES heritage(id) ON DELETE CASCADE,
    PRIMARY KEY (recipe_id, heritage_id)
);

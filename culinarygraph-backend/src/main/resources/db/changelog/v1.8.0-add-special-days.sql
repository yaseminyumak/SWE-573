--liquibase formatted sql
--changeset culinarygraph:v1.8.0-add-special-days

CREATE TABLE recipe_special_days (
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    special_day VARCHAR(100) NOT NULL
);

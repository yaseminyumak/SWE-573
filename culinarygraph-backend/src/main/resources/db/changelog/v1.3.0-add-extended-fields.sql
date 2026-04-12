--liquibase formatted sql

--changeset culinarygraph:4
ALTER TABLE ingredients ADD COLUMN IF NOT EXISTS country VARCHAR(255);

CREATE TABLE IF NOT EXISTS ingredient_related_techniques (
    ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
    technique_name VARCHAR(500) NOT NULL
);

ALTER TABLE techniques ADD COLUMN IF NOT EXISTS country VARCHAR(255);
ALTER TABLE techniques ADD COLUMN IF NOT EXISTS cultural_notes TEXT;
ALTER TABLE techniques ADD COLUMN IF NOT EXISTS prerequisites TEXT;

CREATE TABLE IF NOT EXISTS technique_related_techniques (
    technique_id UUID NOT NULL REFERENCES techniques(id) ON DELETE CASCADE,
    technique_name VARCHAR(500) NOT NULL
);

CREATE TABLE IF NOT EXISTS technique_related_ingredient_names (
    technique_id UUID NOT NULL REFERENCES techniques(id) ON DELETE CASCADE,
    ingredient_name VARCHAR(500) NOT NULL
);

ALTER TABLE recipes ADD COLUMN IF NOT EXISTS country VARCHAR(255);
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS origin_story TEXT;

CREATE TABLE IF NOT EXISTS recipe_tags (
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    tag VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS recipe_associated_techniques (
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    technique_name VARCHAR(500) NOT NULL
);

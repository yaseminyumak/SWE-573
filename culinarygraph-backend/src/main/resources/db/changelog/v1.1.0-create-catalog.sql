--liquibase formatted sql
--changeset culinarygraph:2
CREATE TABLE ingredients (
    id UUID PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    description TEXT,
    region VARCHAR(255),
    provenance_story TEXT,
    status VARCHAR(20) NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE ingredient_seasons (
    ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
    season VARCHAR(20) NOT NULL
);

CREATE TABLE ingredient_substitutes (
    ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
    substitute_name VARCHAR(500) NOT NULL
);

CREATE TABLE techniques (
    id UUID PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    description TEXT,
    region VARCHAR(255),
    difficulty VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE technique_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    technique_id UUID NOT NULL REFERENCES techniques(id) ON DELETE CASCADE,
    step_order INT NOT NULL,
    instruction TEXT NOT NULL
);

CREATE TABLE technique_ingredients (
    technique_id UUID NOT NULL REFERENCES techniques(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
    PRIMARY KEY (technique_id, ingredient_id)
);

CREATE INDEX idx_ingredient_seasons_ingredient_id ON ingredient_seasons(ingredient_id);
CREATE INDEX idx_ingredient_substitutes_ingredient_id ON ingredient_substitutes(ingredient_id);
CREATE INDEX idx_technique_steps_technique_id ON technique_steps(technique_id);
CREATE INDEX idx_technique_ingredients_technique_id ON technique_ingredients(technique_id);

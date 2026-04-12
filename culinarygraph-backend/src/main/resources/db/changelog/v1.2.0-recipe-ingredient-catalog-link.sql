--liquibase formatted sql
--changeset culinarygraph:3
ALTER TABLE recipe_ingredients ADD COLUMN ingredient_id UUID REFERENCES ingredients(id) ON DELETE SET NULL;

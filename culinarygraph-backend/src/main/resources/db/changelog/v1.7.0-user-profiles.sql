--liquibase formatted sql

--changeset culinarygraph:8
CREATE TABLE user_profiles (
    username    VARCHAR(255) PRIMARY KEY,
    bio         TEXT,
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

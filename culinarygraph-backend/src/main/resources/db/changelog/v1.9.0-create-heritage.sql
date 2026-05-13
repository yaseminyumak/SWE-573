--liquibase formatted sql

--changeset yaseminyumak:v1.9.0-create-heritage
CREATE TABLE heritage (
    id          UUID        PRIMARY KEY,
    name        VARCHAR(500) NOT NULL,
    country     VARCHAR(255) NOT NULL,
    description TEXT         NOT NULL,
    created_by  VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP    NOT NULL,
    updated_at  TIMESTAMP    NOT NULL
);

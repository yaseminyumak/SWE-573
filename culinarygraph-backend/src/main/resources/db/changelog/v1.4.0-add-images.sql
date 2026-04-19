--liquibase formatted sql

--changeset culinarygraph:5
CREATE TABLE content_images (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type  VARCHAR(50)  NOT NULL,
    entity_id    UUID         NOT NULL,
    filename     VARCHAR(500) NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    data         BYTEA        NOT NULL,
    display_order INT         NOT NULL DEFAULT 0,
    created_at   TIMESTAMP    NOT NULL DEFAULT now()
);

CREATE INDEX idx_content_images_entity ON content_images(entity_type, entity_id);

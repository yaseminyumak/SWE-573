--liquibase formatted sql

--changeset culinarygraph:7

CREATE TABLE social_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(20) NOT NULL,
    entity_id UUID NOT NULL,
    username VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_like UNIQUE(entity_type, entity_id, username)
);

CREATE TABLE social_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(20) NOT NULL,
    entity_id UUID NOT NULL,
    username VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_likes_entity ON social_likes(entity_type, entity_id);
CREATE INDEX idx_comments_entity ON social_comments(entity_type, entity_id);

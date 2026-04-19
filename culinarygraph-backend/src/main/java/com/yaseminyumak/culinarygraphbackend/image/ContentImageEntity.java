package com.yaseminyumak.culinarygraphbackend.image;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "content_images")
public class ContentImageEntity {

    @Id
    @GeneratedValue
    @Column(name = "id")
    private UUID id;

    @Column(name = "entity_type", nullable = false, length = 50)
    private String entityType;

    @Column(name = "entity_id", nullable = false)
    private UUID entityId;

    @Column(name = "filename", nullable = false, length = 500)
    private String filename;

    @Column(name = "content_type", nullable = false, length = 100)
    private String contentType;

    @JdbcTypeCode(SqlTypes.BINARY)
    @Column(name = "data", nullable = false, columnDefinition = "BYTEA")
    private byte[] data;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    protected ContentImageEntity() {}

    public ContentImageEntity(String entityType, UUID entityId, String filename, String contentType, byte[] data, int displayOrder) {
        this.entityType = entityType;
        this.entityId = entityId;
        this.filename = filename;
        this.contentType = contentType;
        this.data = data;
        this.displayOrder = displayOrder;
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public String getEntityType() { return entityType; }
    public UUID getEntityId() { return entityId; }
    public String getFilename() { return filename; }
    public String getContentType() { return contentType; }
    public byte[] getData() { return data; }
    public int getDisplayOrder() { return displayOrder; }
    public Instant getCreatedAt() { return createdAt; }
}

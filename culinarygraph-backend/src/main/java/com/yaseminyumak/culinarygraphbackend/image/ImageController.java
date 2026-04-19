package com.yaseminyumak.culinarygraphbackend.image;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    private final ContentImageJpaRepository repo;

    public ImageController(ContentImageJpaRepository repo) {
        this.repo = repo;
    }

    /** Upload a new image for an entity. */
    @PostMapping("/{entityType}/{entityId}")
    public ResponseEntity<ImageMetaResponse> upload(
            @PathVariable String entityType,
            @PathVariable UUID entityId,
            @RequestParam("file") MultipartFile file) throws IOException {

        String contentType = file.getContentType() != null ? file.getContentType() : "application/octet-stream";
        int nextOrder = repo.findByEntityTypeAndEntityId(entityType.toUpperCase(), entityId).size();
        ContentImageEntity saved = repo.save(new ContentImageEntity(
                entityType.toUpperCase(),
                entityId,
                file.getOriginalFilename() != null ? file.getOriginalFilename() : "image",
                contentType,
                file.getBytes(),
                nextOrder
        ));
        return ResponseEntity.status(HttpStatus.CREATED).body(toMeta(saved));
    }

    /** List image metadata (no binary data) for an entity. */
    @GetMapping("/entity/{entityType}/{entityId}")
    public List<ImageMetaResponse> list(
            @PathVariable String entityType,
            @PathVariable UUID entityId) {
        return repo.findByEntityTypeAndEntityId(entityType.toUpperCase(), entityId)
                   .stream().map(this::toMeta).toList();
    }

    /** Serve the raw image bytes. */
    @GetMapping("/{id}")
    public ResponseEntity<byte[]> get(@PathVariable UUID id) {
        return repo.findById(id)
                .map(img -> ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(img.getContentType()))
                        .body(img.getData()))
                .orElse(ResponseEntity.notFound().build());
    }

    /** Delete an image. */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        repo.deleteById(id);
    }

    private ImageMetaResponse toMeta(ContentImageEntity e) {
        return new ImageMetaResponse(e.getId(), e.getFilename(), e.getContentType(), e.getDisplayOrder(), e.getCreatedAt());
    }

    public record ImageMetaResponse(UUID id, String filename, String contentType, int displayOrder, Instant createdAt) {}
}

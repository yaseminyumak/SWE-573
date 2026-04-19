package com.yaseminyumak.culinarygraphbackend.image;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ContentImageJpaRepository extends JpaRepository<ContentImageEntity, UUID> {

    @Query("SELECT i FROM ContentImageEntity i WHERE i.entityType = :type AND i.entityId = :id ORDER BY i.displayOrder ASC, i.createdAt ASC")
    List<ContentImageEntity> findByEntityTypeAndEntityId(@Param("type") String entityType, @Param("id") UUID entityId);
}

package com.yaseminyumak.culinarygraphbackend.social.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LikeJpaRepository extends JpaRepository<LikeEntity, UUID> {
	Optional<LikeEntity> findByEntityTypeAndEntityIdAndUsername(String entityType, UUID entityId, String username);
	long countByEntityTypeAndEntityId(String entityType, UUID entityId);
	List<LikeEntity> findByUsername(String username);
}

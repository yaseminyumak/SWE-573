package com.yaseminyumak.culinarygraphbackend.social.domain;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LikeRepository {
	Like save(Like like);
	Optional<Like> findByEntityTypeAndEntityIdAndUsername(String entityType, UUID entityId, String username);
	long countByEntityTypeAndEntityId(String entityType, UUID entityId);
	List<Like> findByUsername(String username);
	void delete(Like like);
}

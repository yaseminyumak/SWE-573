package com.yaseminyumak.culinarygraphbackend.social.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface CommentJpaRepository extends JpaRepository<CommentEntity, UUID> {
	List<CommentEntity> findByEntityTypeAndEntityIdOrderByCreatedAtAsc(String entityType, UUID entityId);
	List<CommentEntity> findByUsernameOrderByCreatedAtDesc(String username);
}

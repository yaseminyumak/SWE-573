package com.yaseminyumak.culinarygraphbackend.social.domain;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CommentRepository {
	Comment save(Comment comment);
	Optional<Comment> findById(UUID id);
	List<Comment> findByEntityTypeAndEntityId(String entityType, UUID entityId);
	List<Comment> findByUsername(String username);
	void delete(Comment comment);
}

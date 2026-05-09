package com.yaseminyumak.culinarygraphbackend.social.infrastructure;

import com.yaseminyumak.culinarygraphbackend.social.domain.Comment;
import com.yaseminyumak.culinarygraphbackend.social.domain.CommentRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class CommentRepositoryImpl implements CommentRepository {

	private final CommentJpaRepository jpa;

	public CommentRepositoryImpl(CommentJpaRepository jpa) {
		this.jpa = jpa;
	}

	@Override
	public Comment save(Comment comment) {
		return toDomain(jpa.save(toEntity(comment)));
	}

	@Override
	public Optional<Comment> findById(UUID id) {
		return jpa.findById(id).map(this::toDomain);
	}

	@Override
	public List<Comment> findByEntityTypeAndEntityId(String entityType, UUID entityId) {
		return jpa.findByEntityTypeAndEntityIdOrderByCreatedAtAsc(entityType, entityId)
			.stream().map(this::toDomain).collect(Collectors.toList());
	}

	@Override
	public List<Comment> findByUsername(String username) {
		return jpa.findByUsernameOrderByCreatedAtDesc(username)
			.stream().map(this::toDomain).collect(Collectors.toList());
	}

	@Override
	public void delete(Comment comment) {
		jpa.deleteById(comment.getId());
	}

	private CommentEntity toEntity(Comment c) {
		CommentEntity e = new CommentEntity();
		e.setId(c.getId());
		e.setEntityType(c.getEntityType());
		e.setEntityId(c.getEntityId());
		e.setUsername(c.getUsername());
		e.setBody(c.getBody());
		e.setCreatedAt(c.getCreatedAt());
		return e;
	}

	private Comment toDomain(CommentEntity e) {
		return Comment.fromPersistence(e.getId(), e.getEntityType(), e.getEntityId(), e.getUsername(), e.getBody(), e.getCreatedAt());
	}
}

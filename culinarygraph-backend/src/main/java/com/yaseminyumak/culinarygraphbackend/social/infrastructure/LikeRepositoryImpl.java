package com.yaseminyumak.culinarygraphbackend.social.infrastructure;

import com.yaseminyumak.culinarygraphbackend.social.domain.Like;
import com.yaseminyumak.culinarygraphbackend.social.domain.LikeRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class LikeRepositoryImpl implements LikeRepository {

	private final LikeJpaRepository jpa;

	public LikeRepositoryImpl(LikeJpaRepository jpa) {
		this.jpa = jpa;
	}

	@Override
	public Like save(Like like) {
		LikeEntity e = toEntity(like);
		return toDomain(jpa.save(e));
	}

	@Override
	public Optional<Like> findByEntityTypeAndEntityIdAndUsername(String entityType, UUID entityId, String username) {
		return jpa.findByEntityTypeAndEntityIdAndUsername(entityType, entityId, username).map(this::toDomain);
	}

	@Override
	public long countByEntityTypeAndEntityId(String entityType, UUID entityId) {
		return jpa.countByEntityTypeAndEntityId(entityType, entityId);
	}

	@Override
	public List<Like> findByUsername(String username) {
		return jpa.findByUsername(username).stream().map(this::toDomain).collect(Collectors.toList());
	}

	@Override
	public void delete(Like like) {
		jpa.deleteById(like.getId());
	}

	private LikeEntity toEntity(Like like) {
		LikeEntity e = new LikeEntity();
		e.setId(like.getId());
		e.setEntityType(like.getEntityType());
		e.setEntityId(like.getEntityId());
		e.setUsername(like.getUsername());
		e.setCreatedAt(like.getCreatedAt());
		return e;
	}

	private Like toDomain(LikeEntity e) {
		return Like.fromPersistence(e.getId(), e.getEntityType(), e.getEntityId(), e.getUsername(), e.getCreatedAt());
	}
}

package com.yaseminyumak.culinarygraphbackend.social.application;

import com.yaseminyumak.culinarygraphbackend.social.domain.Like;
import com.yaseminyumak.culinarygraphbackend.social.domain.LikeRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class LikeService {

	private final LikeRepository likeRepository;

	public LikeService(LikeRepository likeRepository) {
		this.likeRepository = likeRepository;
	}

	@Transactional
	public LikeStatus toggle(String entityType, UUID entityId) {
		String username = requireUsername();
		Optional<Like> existing = likeRepository.findByEntityTypeAndEntityIdAndUsername(entityType, entityId, username);
		if (existing.isPresent()) {
			likeRepository.delete(existing.get());
		} else {
			likeRepository.save(Like.create(entityType, entityId, username));
		}
		long count = likeRepository.countByEntityTypeAndEntityId(entityType, entityId);
		boolean likedByMe = existing.isEmpty();
		return new LikeStatus(count, likedByMe);
	}

	@Transactional(readOnly = true)
	public LikeStatus getStatus(String entityType, UUID entityId) {
		long count = likeRepository.countByEntityTypeAndEntityId(entityType, entityId);
		String username = currentUsername();
		boolean likedByMe = username != null &&
			likeRepository.findByEntityTypeAndEntityIdAndUsername(entityType, entityId, username).isPresent();
		return new LikeStatus(count, likedByMe);
	}

	@Transactional(readOnly = true)
	public List<Like> getMyLikes() {
		String username = currentUsername();
		if (username == null) return List.of();
		return likeRepository.findByUsername(username);
	}

	public record LikeStatus(long count, boolean likedByMe) {}

	private String requireUsername() {
		String username = currentUsername();
		if (username == null) throw new org.springframework.web.server.ResponseStatusException(
			org.springframework.http.HttpStatus.UNAUTHORIZED, "Authentication required");
		return username;
	}

	private static String currentUsername() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth instanceof JwtAuthenticationToken jwtAuth) {
			return jwtAuth.getToken().getClaimAsString("preferred_username");
		}
		return null;
	}
}

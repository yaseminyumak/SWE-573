package com.yaseminyumak.culinarygraphbackend.social.application;

import com.yaseminyumak.culinarygraphbackend.social.domain.Comment;
import com.yaseminyumak.culinarygraphbackend.social.domain.CommentNotFoundException;
import com.yaseminyumak.culinarygraphbackend.social.domain.CommentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class CommentService {

	private final CommentRepository commentRepository;

	public CommentService(CommentRepository commentRepository) {
		this.commentRepository = commentRepository;
	}

	@Transactional(readOnly = true)
	public List<Comment> getComments(String entityType, UUID entityId) {
		return commentRepository.findByEntityTypeAndEntityId(entityType, entityId);
	}

	@Transactional
	public Comment addComment(String entityType, UUID entityId, String body) {
		String username = requireUsername();
		return commentRepository.save(Comment.create(entityType, entityId, username, body));
	}

	@Transactional
	public void deleteComment(UUID id) {
		String username = requireUsername();
		Comment comment = commentRepository.findById(id)
			.orElseThrow(() -> new CommentNotFoundException(id));
		if (!comment.getUsername().equals(username)) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the author can delete this comment");
		}
		commentRepository.delete(comment);
	}

	@Transactional(readOnly = true)
	public List<Comment> getMyComments() {
		String username = currentUsername();
		if (username == null) return List.of();
		return commentRepository.findByUsername(username);
	}

	private String requireUsername() {
		String username = currentUsername();
		if (username == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
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

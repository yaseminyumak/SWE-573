package com.yaseminyumak.culinarygraphbackend.social.api;

import com.yaseminyumak.culinarygraphbackend.social.api.dto.AddCommentRequest;
import com.yaseminyumak.culinarygraphbackend.social.api.dto.CommentResponse;
import com.yaseminyumak.culinarygraphbackend.social.application.CommentService;
import com.yaseminyumak.culinarygraphbackend.social.domain.CommentNotFoundException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/social/comments")
public class CommentController {

	private final CommentService commentService;

	public CommentController(CommentService commentService) {
		this.commentService = commentService;
	}

	@GetMapping
	public List<CommentResponse> list(@RequestParam String entityType, @RequestParam UUID entityId) {
		return commentService.getComments(entityType, entityId).stream()
			.map(c -> new CommentResponse(c.getId().toString(), c.getUsername(), c.getBody(), c.getCreatedAt().toString()))
			.toList();
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public CommentResponse add(@Valid @RequestBody AddCommentRequest request) {
		var c = commentService.addComment(request.entityType(), UUID.fromString(request.entityId()), request.body());
		return new CommentResponse(c.getId().toString(), c.getUsername(), c.getBody(), c.getCreatedAt().toString());
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable UUID id) {
		commentService.deleteComment(id);
	}

	@GetMapping("/mine")
	public List<CommentResponse> mine() {
		return commentService.getMyComments().stream()
			.map(c -> new CommentResponse(c.getId().toString(), c.getUsername(), c.getBody(), c.getCreatedAt().toString()))
			.toList();
	}

	@ExceptionHandler(CommentNotFoundException.class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	public void handleNotFound() {}
}

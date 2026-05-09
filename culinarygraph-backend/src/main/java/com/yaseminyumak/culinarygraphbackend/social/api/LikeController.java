package com.yaseminyumak.culinarygraphbackend.social.api;

import com.yaseminyumak.culinarygraphbackend.social.api.dto.LikedEntityResponse;
import com.yaseminyumak.culinarygraphbackend.social.api.dto.LikeStatusResponse;
import com.yaseminyumak.culinarygraphbackend.social.api.dto.ToggleLikeRequest;
import com.yaseminyumak.culinarygraphbackend.social.application.LikeService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/social/likes")
public class LikeController {

	private final LikeService likeService;

	public LikeController(LikeService likeService) {
		this.likeService = likeService;
	}

	@GetMapping
	public LikeStatusResponse getStatus(@RequestParam String entityType, @RequestParam UUID entityId) {
		LikeService.LikeStatus status = likeService.getStatus(entityType, entityId);
		return new LikeStatusResponse(status.count(), status.likedByMe());
	}

	@PostMapping
	public LikeStatusResponse toggle(@Valid @RequestBody ToggleLikeRequest request) {
		LikeService.LikeStatus status = likeService.toggle(request.entityType(), UUID.fromString(request.entityId()));
		return new LikeStatusResponse(status.count(), status.likedByMe());
	}

	@GetMapping("/mine")
	public List<LikedEntityResponse> mine() {
		return likeService.getMyLikes().stream()
			.map(l -> new LikedEntityResponse(l.getEntityType(), l.getEntityId().toString()))
			.toList();
	}
}

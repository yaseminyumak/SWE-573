package com.yaseminyumak.culinarygraphbackend.heritage.application;

import com.yaseminyumak.culinarygraphbackend.heritage.api.dto.CreateHeritageRequest;
import com.yaseminyumak.culinarygraphbackend.heritage.domain.Heritage;
import com.yaseminyumak.culinarygraphbackend.heritage.domain.HeritageRepository;
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
public class HeritageService {

	private final HeritageRepository heritageRepository;

	public HeritageService(HeritageRepository heritageRepository) {
		this.heritageRepository = heritageRepository;
	}

	@Transactional
	public Heritage create(CreateHeritageRequest request) {
		String createdBy = getCurrentUserId();
		Heritage heritage = Heritage.create(request.name(), request.country(), request.description(), createdBy);
		return heritageRepository.save(heritage);
	}

	@Transactional(readOnly = true)
	public List<Heritage> findAll() {
		return heritageRepository.findAll();
	}

	@Transactional(readOnly = true)
	public Heritage getById(UUID id) {
		return heritageRepository.findById(id)
			.orElseThrow(() -> new HeritageNotFoundException(id));
	}

	@Transactional
	public Heritage update(UUID id, CreateHeritageRequest request) {
		Heritage heritage = getById(id);
		requireOwner(heritage.getCreatedBy());
		heritage.update(request.name(), request.country(), request.description());
		return heritageRepository.save(heritage);
	}

	@Transactional
	public void delete(UUID id) {
		Heritage heritage = getById(id);
		requireOwner(heritage.getCreatedBy());
		heritageRepository.delete(heritage);
	}

	private static void requireOwner(String createdBy) {
		if (!createdBy.equals(getCurrentUserId())) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the creator can modify this content");
		}
	}

	private static String getCurrentUserId() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth instanceof JwtAuthenticationToken jwtAuth) {
			String username = jwtAuth.getToken().getClaimAsString("preferred_username");
			if (username != null && !username.isBlank()) return username;
		}
		return "local-dev-user";
	}
}

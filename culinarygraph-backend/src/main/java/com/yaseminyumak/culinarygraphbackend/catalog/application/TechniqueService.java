package com.yaseminyumak.culinarygraphbackend.catalog.application;

import com.yaseminyumak.culinarygraphbackend.catalog.api.dto.CreateTechniqueRequest;
import com.yaseminyumak.culinarygraphbackend.catalog.domain.Technique;
import com.yaseminyumak.culinarygraphbackend.catalog.domain.TechniqueRepository;
import com.yaseminyumak.culinarygraphbackend.catalog.domain.TechniqueStep;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TechniqueService {

	private final TechniqueRepository techniqueRepository;

	public TechniqueService(TechniqueRepository techniqueRepository) {
		this.techniqueRepository = techniqueRepository;
	}

	@Transactional
	public Technique create(CreateTechniqueRequest request) {
		String createdBy = getCurrentUserId();
		List<TechniqueStep> steps = request.steps() != null
			? request.steps().stream()
				.map(s -> new TechniqueStep(s.order(), s.instruction()))
				.collect(Collectors.toList())
			: List.of();
		Technique technique = Technique.create(
			request.name(),
			request.description(),
			request.region(),
			request.difficulty(),
			steps,
			request.ingredientIds() != null ? new HashSet<>(request.ingredientIds()) : new HashSet<>(),
			request.country(),
			request.culturalNotes(),
			request.prerequisites(),
			request.relatedTechniqueNames(),
			request.relatedIngredientNames(),
			createdBy
		);
		return techniqueRepository.save(technique);
	}

	@Transactional(readOnly = true)
	public List<Technique> findAll() {
		return techniqueRepository.findAll();
	}

	@Transactional(readOnly = true)
	public Technique getById(UUID id) {
		return techniqueRepository.findById(id)
			.orElseThrow(() -> new TechniqueNotFoundException(id));
	}

	@Transactional
	public Technique publish(UUID id) {
		Technique technique = getById(id);
		technique.publish();
		return techniqueRepository.save(technique);
	}

	@Transactional
	public Technique archive(UUID id) {
		Technique technique = getById(id);
		technique.archive();
		return techniqueRepository.save(technique);
	}

	private static String getCurrentUserId() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth != null && auth.isAuthenticated() && auth.getPrincipal() != null
			&& !"anonymousUser".equals(auth.getPrincipal().toString())) {
			return auth.getName();
		}
		return "local-dev-user";
	}
}

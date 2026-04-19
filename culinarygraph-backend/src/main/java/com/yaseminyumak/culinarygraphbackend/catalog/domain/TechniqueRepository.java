package com.yaseminyumak.culinarygraphbackend.catalog.domain;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TechniqueRepository {
	Technique save(Technique technique);
	Optional<Technique> findById(UUID id);
	List<Technique> findAll();
	void delete(Technique technique);
}

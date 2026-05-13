package com.yaseminyumak.culinarygraphbackend.heritage.domain;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface HeritageRepository {
	Heritage save(Heritage heritage);
	Optional<Heritage> findById(UUID id);
	List<Heritage> findAll();
	void delete(Heritage heritage);
}

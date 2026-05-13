package com.yaseminyumak.culinarygraphbackend.heritage.infrastructure;

import com.yaseminyumak.culinarygraphbackend.heritage.domain.Heritage;
import com.yaseminyumak.culinarygraphbackend.heritage.domain.HeritageRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class HeritageRepositoryImpl implements HeritageRepository {

	private final HeritageJpaRepository jpaRepository;

	public HeritageRepositoryImpl(HeritageJpaRepository jpaRepository) {
		this.jpaRepository = jpaRepository;
	}

	@Override
	public Heritage save(Heritage heritage) {
		HeritageEntity entity = toEntity(heritage);
		HeritageEntity saved = jpaRepository.save(entity);
		return toDomain(saved);
	}

	@Override
	public Optional<Heritage> findById(UUID id) {
		return jpaRepository.findById(id).map(this::toDomain);
	}

	@Override
	public List<Heritage> findAll() {
		return jpaRepository.findAllOrderedByCreatedAt().stream()
			.map(this::toDomain)
			.collect(Collectors.toList());
	}

	@Override
	public void delete(Heritage heritage) {
		jpaRepository.deleteById(heritage.getId());
	}

	private HeritageEntity toEntity(Heritage heritage) {
		HeritageEntity e = new HeritageEntity();
		e.setId(heritage.getId());
		e.setName(heritage.getName());
		e.setCountry(heritage.getCountry());
		e.setDescription(heritage.getDescription());
		e.setCreatedBy(heritage.getCreatedBy());
		e.setCreatedAt(heritage.getCreatedAt());
		e.setUpdatedAt(heritage.getUpdatedAt());
		return e;
	}

	private Heritage toDomain(HeritageEntity e) {
		return Heritage.fromPersistence(
			e.getId(), e.getName(), e.getCountry(), e.getDescription(),
			e.getCreatedBy(), e.getCreatedAt(), e.getUpdatedAt()
		);
	}
}

package com.yaseminyumak.culinarygraphbackend.heritage.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface HeritageJpaRepository extends JpaRepository<HeritageEntity, UUID> {

	@Query("select h from HeritageEntity h order by h.createdAt desc")
	List<HeritageEntity> findAllOrderedByCreatedAt();
}

package com.yaseminyumak.culinarygraphbackend.userprofile.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProfileJpaRepository extends JpaRepository<UserProfileEntity, String> {}

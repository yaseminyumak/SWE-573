package com.yaseminyumak.culinarygraphbackend.userprofile.domain;

import java.util.Optional;

public interface UserProfileRepository {
    Optional<UserProfile> findByUsername(String username);
    UserProfile save(UserProfile profile);
}

package com.yaseminyumak.culinarygraphbackend.userprofile.infrastructure;

import com.yaseminyumak.culinarygraphbackend.userprofile.domain.UserProfile;
import com.yaseminyumak.culinarygraphbackend.userprofile.domain.UserProfileRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class UserProfileRepositoryImpl implements UserProfileRepository {

    private final UserProfileJpaRepository jpa;

    public UserProfileRepositoryImpl(UserProfileJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public Optional<UserProfile> findByUsername(String username) {
        return jpa.findById(username)
                .map(e -> UserProfile.of(e.getUsername(), e.getBio()));
    }

    @Override
    public UserProfile save(UserProfile profile) {
        UserProfileEntity entity = jpa.findById(profile.getUsername())
                .orElseGet(() -> new UserProfileEntity(profile.getUsername(), null));
        entity.setBio(profile.getBio());
        UserProfileEntity saved = jpa.save(entity);
        return UserProfile.of(saved.getUsername(), saved.getBio());
    }
}

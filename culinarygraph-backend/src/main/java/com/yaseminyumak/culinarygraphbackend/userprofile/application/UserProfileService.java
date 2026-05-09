package com.yaseminyumak.culinarygraphbackend.userprofile.application;

import com.yaseminyumak.culinarygraphbackend.userprofile.domain.UserProfile;
import com.yaseminyumak.culinarygraphbackend.userprofile.domain.UserProfileRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserProfileService {

    private final UserProfileRepository repository;

    public UserProfileService(UserProfileRepository repository) {
        this.repository = repository;
    }

    public Optional<UserProfile> getProfile(String username) {
        return repository.findByUsername(username);
    }

    public UserProfile saveBio(String bio) {
        String username = currentUsername();
        UserProfile profile = repository.findByUsername(username)
                .orElseGet(() -> UserProfile.of(username, null));
        profile.setBio(bio != null ? bio.strip() : null);
        return repository.save(profile);
    }

    private static String currentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth instanceof JwtAuthenticationToken jwtAuth) {
            String username = jwtAuth.getToken().getClaimAsString("preferred_username");
            if (username != null && !username.isBlank()) return username;
        }
        return "local-dev-user";
    }
}

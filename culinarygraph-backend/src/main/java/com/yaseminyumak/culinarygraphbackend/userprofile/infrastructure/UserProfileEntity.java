package com.yaseminyumak.culinarygraphbackend.userprofile.infrastructure;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "user_profiles")
public class UserProfileEntity {

    @Id
    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected UserProfileEntity() {}

    public UserProfileEntity(String username, String bio) {
        this.username = username;
        this.bio = bio;
        this.updatedAt = Instant.now();
    }

    public String getUsername() { return username; }
    public String getBio() { return bio; }
    public void setBio(String bio) {
        this.bio = bio;
        this.updatedAt = Instant.now();
    }
}

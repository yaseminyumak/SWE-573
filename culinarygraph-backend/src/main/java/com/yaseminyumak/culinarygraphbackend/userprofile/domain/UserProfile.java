package com.yaseminyumak.culinarygraphbackend.userprofile.domain;

public class UserProfile {
    private final String username;
    private String bio;

    private UserProfile(String username, String bio) {
        this.username = username;
        this.bio = bio;
    }

    public static UserProfile of(String username, String bio) {
        return new UserProfile(username, bio);
    }

    public String getUsername() { return username; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
}

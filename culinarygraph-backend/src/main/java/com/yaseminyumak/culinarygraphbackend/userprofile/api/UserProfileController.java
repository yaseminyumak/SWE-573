package com.yaseminyumak.culinarygraphbackend.userprofile.api;

import com.yaseminyumak.culinarygraphbackend.userprofile.api.dto.UpdateBioRequest;
import com.yaseminyumak.culinarygraphbackend.userprofile.api.dto.UserProfileResponse;
import com.yaseminyumak.culinarygraphbackend.userprofile.application.UserProfileService;
import com.yaseminyumak.culinarygraphbackend.userprofile.domain.UserProfile;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profiles")
public class UserProfileController {

    private final UserProfileService service;

    public UserProfileController(UserProfileService service) {
        this.service = service;
    }

    @GetMapping("/{username}")
    public UserProfileResponse getProfile(@PathVariable String username) {
        return service.getProfile(username)
                .map(p -> new UserProfileResponse(p.getUsername(), p.getBio()))
                .orElse(new UserProfileResponse(username, null));
    }

    @PutMapping("/me/bio")
    public UserProfileResponse updateBio(@RequestBody UpdateBioRequest request) {
        UserProfile saved = service.saveBio(request.bio());
        return new UserProfileResponse(saved.getUsername(), saved.getBio());
    }
}

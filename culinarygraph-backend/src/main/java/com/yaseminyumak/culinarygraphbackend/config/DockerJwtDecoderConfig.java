package com.yaseminyumak.culinarygraphbackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;

/**
 * In Docker/Podman, the JWT {@code iss} claim uses the browser-facing Keycloak URL
 * (e.g. {@code http://localhost:8180/realms/...}) while the resource server resolves JWKS
 * from the internal service hostname ({@code keycloak:8080}). Using the JWK set URI directly
 * avoids issuer metadata mismatch between host and internal network.
 */
@Configuration
@Profile("docker")
public class DockerJwtDecoderConfig {

	private static final String KEYCLOAK_JWKS =
		"http://keycloak:8080/realms/culinarygraph/protocol/openid-connect/certs";

	@Bean
	@Primary
	public JwtDecoder keycloakJwtDecoder() {
		return NimbusJwtDecoder.withJwkSetUri(KEYCLOAK_JWKS).build();
	}
}

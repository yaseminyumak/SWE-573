package com.yaseminyumak.culinarygraphbackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

import java.util.*;
import java.util.stream.Collectors;

@Configuration
@EnableWebSecurity
@Profile("!local")
public class SecurityConfig {

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
			.csrf(csrf -> csrf.disable())
			.authorizeHttpRequests(auth -> auth
				.requestMatchers(org.springframework.http.HttpMethod.GET, "/api/**").permitAll()
				.requestMatchers(org.springframework.http.HttpMethod.POST, "/api/**").authenticated()
				.requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/**").authenticated()
				.requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/**").authenticated()
				.anyRequest().authenticated()
			)
			.oauth2ResourceServer(oauth2 -> oauth2
				.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
			);
		return http.build();
	}

	private Converter<Jwt, ? extends AbstractAuthenticationToken> jwtAuthenticationConverter() {
		JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
		converter.setJwtGrantedAuthoritiesConverter(jwt -> {
			Set<String> roles = new HashSet<>();
			Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");
			if (realmAccess != null && realmAccess.containsKey("roles")) {
				@SuppressWarnings("unchecked")
				Collection<String> realmRoles = (Collection<String>) realmAccess.get("roles");
				if (realmRoles != null) {
					roles.addAll(realmRoles);
				}
			}
			return roles.stream()
				.map(role -> {
					if ("culinarygraph-contributor".equals(role)) return "ROLE_CONTRIBUTOR";
					if ("culinarygraph-validator".equals(role)) return "ROLE_VALIDATOR";
					return "ROLE_" + role.toUpperCase().replace("-", "_");
				})
				.map(SimpleGrantedAuthority::new)
				.collect(Collectors.toList());
		});
		return converter;
	}
}

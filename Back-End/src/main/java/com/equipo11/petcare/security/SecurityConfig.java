package com.equipo11.petcare.security;

import com.equipo11.petcare.security.filter.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private static final String API_V1 = "/api/v1";

    private final JwtAuthenticationFilter filter;

    private final UserDetailsService userDetailsService;

    public SecurityConfig(JwtAuthenticationFilter filter,
                          UserDetailsService userDetailsService) {
        this.filter = filter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authRequest ->
                        authRequest
                                .requestMatchers(HttpMethod.POST, API_V1 + "/auth/**").permitAll()
                                .requestMatchers(HttpMethod.GET, API_V1 +"/auth/**").permitAll()
                                .requestMatchers(HttpMethod.GET, API_V1 +"/user/**")
                                                .hasAnyAuthority("ROLE_OWNER", "ROLE_USER", "ROLE_ADMIN")
                                .requestMatchers(HttpMethod.PUT, API_V1 +"/user/**")
                                .hasAnyAuthority("ROLE_OWNER", "ROLE_USER", "ROLE_ADMIN")
                                .anyRequest().authenticated())
                .sessionManagement(sessionManager ->
                        sessionManager
                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        http.addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authBuilder =
                http.getSharedObject(AuthenticationManagerBuilder.class);

        authBuilder
                .userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder());

        return authBuilder.build();
    }

}

package com.finflow.backend.controller;

import com.finflow.backend.dto.JwtAuthenticationResponse;
import com.finflow.backend.dto.LoginRequest;
import com.finflow.backend.dto.RegisterRequest;
import com.finflow.backend.dto.UserDto;
import com.finflow.backend.entity.User;
import com.finflow.backend.repository.UserRepository;
import com.finflow.backend.security.JwtTokenProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final com.finflow.backend.repository.PodMemberRepository podMemberRepository;
    private final com.finflow.backend.service.RecurringRuleService recurringRuleService;

    @PostMapping("/login")
    public ResponseEntity<JwtAuthenticationResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        
        User user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow();
        UserDto userDto = new UserDto(user.getId(), user.getEmail(), user.getFirstName(), user.getLastName(), user.getCurrency());

        // Process any overdue rules for this user
        try {
            recurringRuleService.processLoginCatchup(user.getId());
        } catch (Exception e) {
            // Log and ignore to not block login
            e.printStackTrace();
        }

        return ResponseEntity.ok(new JwtAuthenticationResponse(jwt, userDto));
    }

    @PostMapping("/register")
    public ResponseEntity<JwtAuthenticationResponse> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is already taken!");
        }

        User user = User.builder()
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .email(registerRequest.getEmail())
                .passwordHash(passwordEncoder.encode(registerRequest.getPassword()))
                .currency(registerRequest.getCurrency() != null ? registerRequest.getCurrency() : "INR")
                .build();

        User savedUser = userRepository.save(user);

        // Link pending pod invites
        java.util.List<com.finflow.backend.entity.PodMember> pendingMembers = podMemberRepository.findByPendingEmail(savedUser.getEmail());
        for (com.finflow.backend.entity.PodMember pm : pendingMembers) {
            pm.setUser(savedUser);
            pm.setPendingEmail(null);
            podMemberRepository.save(pm);
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(registerRequest.getEmail(), registerRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserDto userDto = new UserDto(savedUser.getId(), savedUser.getEmail(), savedUser.getFirstName(), savedUser.getLastName(), savedUser.getCurrency());
        return ResponseEntity.status(HttpStatus.CREATED).body(new JwtAuthenticationResponse(jwt, userDto));
    }
}

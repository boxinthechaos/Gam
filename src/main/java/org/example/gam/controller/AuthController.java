package org.example.gam.controller;

import lombok.RequiredArgsConstructor;
import org.example.gam.dto.JoinRequest;
import org.example.gam.dto.LoginRequest;
import org.example.gam.dto.TokenResponse;
import org.example.gam.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/join")
    public ResponseEntity<String> join(@RequestBody JoinRequest request){
        authService.join(request);
        return ResponseEntity.ok("회원가입이 완료되었습니다");
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest loginRequest){
        TokenResponse tokenResponse = authService.login(loginRequest);
        return ResponseEntity.ok(tokenResponse);
    }
}

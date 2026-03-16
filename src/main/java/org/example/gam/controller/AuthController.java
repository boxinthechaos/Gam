package org.example.gam.controller;

import lombok.RequiredArgsConstructor;
import org.example.gam.dto.*;
import org.example.gam.service.AuthService;
import org.example.gam.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final EmailService emailService;

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

    @PostMapping("/email/send")
    public ResponseEntity<String> sendEmail(@RequestBody EmailRequest request){
        emailService.sendVerificationCode(request.getEmail());
        return ResponseEntity.ok("이메일 인증코드가 성공적으로 발송되었습니다. 5분 이내로 확인해주세요");
    }

    @PostMapping("/email/verify")
    public ResponseEntity<String> verifyEmail(@RequestBody EmailVerifyRequest request) {
        boolean isVerified = emailService.verifyCode(request.getEmail(), request.getCode());

        if (isVerified) {
            return ResponseEntity.ok("이메일 인증이 완료되었습니다.");
        } else {
            return ResponseEntity.badRequest().body("인증 번호가 틀렸거나 만료되었습니다.");
        }
    }
}

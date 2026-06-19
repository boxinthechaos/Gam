package org.example.gam.service;

import lombok.RequiredArgsConstructor;
import org.example.gam.Repository.*;
import org.example.gam.dto.auth.*;
import org.example.gam.entitiy.RefreshToken;
import org.example.gam.entitiy.Role;
import org.example.gam.entitiy.Trip;
import org.example.gam.entitiy.User;
import org.example.gam.token.TokenProvider;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenProvider tokenProvider;
    private final StringRedisTemplate redisTemplate;
    private final TripRepository tripRepository;
    private final ScheduleRepository scheduleRepository;
    private final PlaylistRepository playlistRepository;

    @Transactional
    public void join(JoinRequest request){
        if(!emailService.isVerified(request.getEmail())){
            throw new IllegalArgumentException("이메일 인증을 먼저 진행해주세요");
        }
        if(userRepository.existsByEmail(request.getEmail())){
            throw new IllegalArgumentException("이미 사용 중인 이메일 입니다");
        }

        if(userRepository.existsByNickname(request.getNickname())){
            throw new IllegalArgumentException("이미 사용 중인 이름 입니다");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .nickname(request.getNickname())
                .build();

        userRepository.save(user);
        redisTemplate.delete("AuthSuccess:" + request.getEmail());
    }

    @Transactional
    public TokenResponse login(LoginRequest request) {
        User user = userRepository.findByNickname(request.getNickname())
                .orElseThrow(() -> new IllegalArgumentException("가입하지 않은 유저 입니다"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치 하지 않습니다");
        }

        String accessToken = tokenProvider.createToken(user.getEmail(), user.getRole().name());
        String refreshToken = tokenProvider.createRefreshToken(user.getEmail());

        RefreshToken saveRefreshToken = refreshTokenRepository.findByEmail(user.getEmail())
                .orElse(RefreshToken.builder()
                        .email(user.getEmail())
                        .token(refreshToken)
                        .build());

        saveRefreshToken.updateToken(refreshToken);
        refreshTokenRepository.save(saveRefreshToken);

        return new TokenResponse(accessToken, refreshToken);
    }

    @Transactional
    public void logout(String email){
        refreshTokenRepository.deleteByEmail(email);
    }

    @Transactional
    public TokenResponse reissue(String refreshTokenRequest){
        if(!tokenProvider.validateToken(refreshTokenRequest)){
            throw new IllegalArgumentException("리프레시 토큰이 만료되었거나 유효하지 않습니다");
        }

        RefreshToken savedToken = refreshTokenRepository.findByToken(refreshTokenRequest)
                .orElseThrow(() -> new IllegalArgumentException("일치하는 리프레시 토큰을 찾을 수 없습니다"));

        User user = userRepository.findByEmail(savedToken.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다"));

        String newAccessToken = tokenProvider.createToken(user.getEmail(), user.getRole().name());
        String newRefreshToken = tokenProvider.createRefreshToken(user.getEmail());

        savedToken.updateToken(newRefreshToken);

        return new TokenResponse(newAccessToken, newRefreshToken);
    }

    @Transactional(readOnly = true)
    public UserResponse findByEmail(String email){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("유저 없음"));

        return new UserResponse(user.getEmail(), user.getNickname());
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request){
        if(!emailService.isVerified(request.getEmail())){
            throw new IllegalArgumentException("이메일 인증을 먼저 진행해주세요");
        }
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("가입하지 않은 유저입니다"));

        String encodedPassword = passwordEncoder.encode(request.getNewPassword());
        user.updatePassword(encodedPassword);

        redisTemplate.delete("AuthSuccess:" + request.getEmail());
    }

    @Transactional
    public void withdraw(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다"));

        List<Trip> trips = tripRepository.findAllByUserId(user.getId());
        scheduleRepository.deleteAllByTripIn(trips);
        tripRepository.deleteAll(trips);
        playlistRepository.deleteAll(playlistRepository.findByUser(user));

        refreshTokenRepository.deleteByEmail(email);
        redisTemplate.delete("AuthSuccess:" + email);
        userRepository.delete(user);
    }
}

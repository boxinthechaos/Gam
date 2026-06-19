package org.example.gam.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender javaMailSender;
    private final StringRedisTemplate redisTemplate;

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Async
    public void sendVerificationCode(String toEmail){
        String code = String.valueOf((int) (Math.random() * 899999) + 100000);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setFrom(senderEmail);
        message.setSubject("[Gam] 여행 앱 회원가입 이메일 인증번호 입니다.");
        message.setText("인증번호는 [" + code +"] 입니다. 5분 이네에 입력해 주세요");
        javaMailSender.send(message);

        redisTemplate.opsForValue().set(toEmail, code, Duration.ofMinutes(5));
    }

    public boolean verifyCode(String email, String inputCode){
        String saveCode = redisTemplate.opsForValue().get(email);

        if(saveCode != null && saveCode.equals(inputCode)){
            redisTemplate.delete(email);
            redisTemplate.opsForValue().set("AuthSuccess:" + email, "true", Duration.ofMinutes(30));
            return true;
        }
        return false;
    }

    public boolean isVerified(String email){
        return Boolean.TRUE.toString().equals(redisTemplate.opsForValue().get("AuthSuccess:" + email));
    }

    public void clearVerificationStatus(String email){
        redisTemplate.delete("AuthSuccess" + email);
    }
}

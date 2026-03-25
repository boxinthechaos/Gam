package org.example.gam.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // IllegalArgumentException이 발생하면 이 메서드가 가로채서 처리합니다.
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException e) {
        // e.getMessage() 에는 "이미 사용 중인 이메일 입니다" 라는 문자열이 들어있습니다.
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
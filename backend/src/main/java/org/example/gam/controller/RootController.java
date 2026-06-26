package org.example.gam.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.io.IOException;

@Controller
public class RootController {

    // 점(.)이 없고 api/assets로 시작하지 않는 모든 경로 -> index.html로 forward
    // 예: /mypage, /signin, /mypage/edit 등은 매칭, /index.html, /assets/x.js 처럼
    // 확장자가 있는 경로나 assets 폴더 경로는 매칭되지 않아 무한 forward 루프 및
    // MIME 타입 오류를 방지함
    @GetMapping(value = "/{path:^(?!api|assets)[^\\.]*}")
    public String index() {
        return "forward:/index.html";
    }

    @GetMapping(value = "/{path:^(?!api|assets)[^\\.]*}/**")
    public String indexNested() {
        return "forward:/index.html";
    }

    @GetMapping("/")
    public String root() {
        return "forward:/index.html";
    }
}
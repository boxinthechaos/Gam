package org.example.gam;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class GamApplication {

    public static void main(String[] args) {
        SpringApplication.run(GamApplication.class, args);
    }

}

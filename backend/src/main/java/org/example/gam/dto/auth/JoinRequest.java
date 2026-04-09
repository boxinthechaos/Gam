package org.example.gam.dto.auth;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class JoinRequest {
    private String email;
    private String password;
    private String nickname;
}

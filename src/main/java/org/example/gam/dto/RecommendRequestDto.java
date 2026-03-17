package org.example.gam.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecommendRequestDto {
    private String companion;
    private String scenery;
    private String style;
    private String transport;
}

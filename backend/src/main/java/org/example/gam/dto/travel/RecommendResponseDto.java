package org.example.gam.dto.travel;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RecommendResponseDto {
    private String recommendedRegion;
    private String reason;
}
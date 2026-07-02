package org.example.gam.dto.travel;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDate;

@Getter
@Builder
public class TripResponseDto {
    private Long id;
    private String title;
    private LocalDate startDate;
    private LocalDate endDate;
}

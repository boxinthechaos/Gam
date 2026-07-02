package org.example.gam.dto.travel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TripRequestDto {
    private String title;
    private LocalDate startDate;
    private LocalDate endDate;
}

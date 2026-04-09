package org.example.gam.dto.travel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TripDetailDto {
    private Long id;
    private String title;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<ScheduleResponseDto> schedules;

}

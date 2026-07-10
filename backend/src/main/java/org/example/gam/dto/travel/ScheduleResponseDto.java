package org.example.gam.dto.travel;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;
import org.example.gam.entitiy.Schedule;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Builder
public class ScheduleResponseDto {
    private Long id;
    private String placeName;
    private String category;
    private LocalDate visitDate;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime startTime;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime endTime;

    private boolean isNextDay;
    private Double lat;
    private Double lng;

    public static ScheduleResponseDto fromEntity(Schedule schedule) {
        return ScheduleResponseDto.builder()
                .id(schedule.getId())
                .placeName(schedule.getPlaceName())
                .category(schedule.getCategory())
                .visitDate(schedule.getVisitDate())
                .startTime(schedule.getStartTime())
                .endTime(schedule.getEndTime())
                .isNextDay(schedule.isNextDay())
                .lat(schedule.getLatitude())
                .lng(schedule.getLongitude())
                .build();
    }
}

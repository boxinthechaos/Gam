package org.example.gam.entitiy;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.example.gam.dto.travel.ScheduleRequestDto;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Getter
@NoArgsConstructor
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id")
    private Trip trip;

    private String placeName;
    private String category;
    private LocalDate visitDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private boolean isNextDay;
    private Double latitude;
    private Double longitude;

    @Builder
    public Schedule(Trip trip, String placeName, String category, LocalDate visitDate, LocalTime startTime, LocalTime endTime, boolean isNextDay, Double latitude, Double longitude) {
        this.trip = trip;
        this.placeName = placeName;
        this.category = category;
        this.visitDate = visitDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.isNextDay = isNextDay;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public void update(ScheduleRequestDto dto) {
        this.placeName = dto.getPlaceName();
        this.category = dto.getCategory();
        this.visitDate = dto.getVisitDate();
        this.startTime = dto.getStartTime();
        this.endTime = dto.getEndTime();
        this.isNextDay = dto.isNextDay();
        if (dto.getLat() != null) this.latitude = dto.getLat();
        if (dto.getLng() != null) this.longitude = dto.getLng();
    }
}

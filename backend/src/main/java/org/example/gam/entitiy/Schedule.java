package org.example.gam.entitiy;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

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

    @Builder
    public Schedule(Trip trip, String placeName, String category, LocalDate visitDate, LocalTime startTime, LocalTime endTime, boolean isNextDay) {
        this.trip = trip;
        this.placeName = placeName;
        this.category = category;
        this.visitDate = visitDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.isNextDay = isNextDay;
    }
}

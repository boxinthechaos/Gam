package org.example.gam.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.gam.Repository.ScheduleRepository;
import org.example.gam.Repository.TripRepository;
import org.example.gam.Repository.UserRepository;
import org.example.gam.dto.travel.*;
import org.example.gam.entitiy.Schedule;
import org.example.gam.entitiy.Trip;
import org.example.gam.entitiy.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import org.example.gam.dto.travel.ScheduleResponseDto;
import org.example.gam.dto.travel.TripDetailDto;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CalendarService {
    private final ScheduleRepository scheduleRepository;
    private final UserRepository userRepository;
    private final TripRepository tripRepository;
    private final AiService aiService;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public void addSchedule(Long tripId, String username, ScheduleRequestDto dto) {

        User user = userRepository.findByEmail(username)
                .orElseGet(() -> userRepository.findByNickname(username)
                        .orElseThrow(() -> new IllegalArgumentException("해당 유저를 찾을 수 없습니다.")));

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new IllegalArgumentException("해당 여행을 찾을 수 없습니다"));

        if (!trip.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("이 여행에 일정을 추가할 권한이 없습니다.");
        }

        Schedule schedule = Schedule.builder()
                .trip(trip)
                .placeName(dto.getPlaceName())
                .category(dto.getCategory())
                .visitDate(dto.getVisitDate())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .isNextDay(dto.isNextDay())
                .build();

        scheduleRepository.save(schedule);

        trip.setAiFeedback(null);
    }

    @Transactional
    public Long createTrip(String username, TripRequestDto dto){
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new IllegalArgumentException("유저가 존재 하지 않습니다"));

        Trip trip = Trip.builder()
                .title(dto.getTitle())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .user(user)
                .build();
        Trip savedTrip = tripRepository.save(trip);
        return savedTrip.getId();
    }

    public List<TripResponseDto> getUserTrips(String username){
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new IllegalArgumentException("유저가 존재하지 않습니다"));

        List<Trip> trips = tripRepository.findAllByUserId(user.getId());

        return trips.stream()
                .map(trip -> TripResponseDto.builder()
                        .id(trip.getId())
                        .title(trip.getTitle())
                        .startDate(trip.getStartDate())
                        .endDate(trip.getEndDate())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public TripDetailDto getTripDetail(Long tripId, String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new IllegalArgumentException("유저가 존재 하지 않습니다"));

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new IllegalArgumentException("해당 여행을 찾을 수 없습니다"));

        if (!trip.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("이 여행의 상세 정보를 볼 권한이 없습니다.");
        }

        List<Schedule> schedules = scheduleRepository.findByTripOrderByVisitDateAscStartTimeAsc(trip);

        return TripDetailDto.builder()
                .id(trip.getId())
                .title(trip.getTitle())
                .startDate(trip.getStartDate())
                .endDate(trip.getEndDate())
                .schedules(schedules.stream()
                        .map(ScheduleResponseDto::fromEntity) // DTO 변환 메서드 구현 필요
                        .collect(Collectors.toList()))
                .build();
    }

    @Transactional
    public void deleteSchedule(Long tripId, Long scheduleId, String username){
        User user = userRepository.findByEmail(username)
                .orElseGet(() -> userRepository.findByNickname(username)
                        .orElseThrow(() -> new IllegalArgumentException("해당 유저를 찾을 수 없습니다.")));

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new IllegalArgumentException("해당 여행을 찾을 수 없습니다."));

        if (!trip.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("이 여행의 일정을 삭제할 권한이 없습니다.");
        }

        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new IllegalArgumentException("해당 일정을 찾을 수 없습니다."));

        if (!schedule.getTrip().getId().equals(trip.getId())) {
            throw new IllegalArgumentException("해당 여행에 속한 일정이 아닙니다.");
        }

        scheduleRepository.delete(schedule);

        trip.setAiFeedback(null);
    }

    @Transactional
    public void deleteTrip(Long tripId, String username){
        User user = userRepository.findByEmail(username)
                .orElseGet(() -> userRepository.findByNickname(username)
                        .orElseThrow(() -> new IllegalArgumentException("해당 유저를 찾을 수 없습니다.")));

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new IllegalArgumentException("해당 여행을 찾을 수 없습니다."));

        if (!trip.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("이 여행을 삭제할 권한이 없습니다.");
        }

        tripRepository.delete(trip);
    }

    @Transactional
    public String getTripFeedback(Long tripId, String username) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new IllegalArgumentException("해당 여행을 찾을 수 없습니다."));
        if (trip.getAiFeedback() != null && !trip.getAiFeedback().isEmpty()) {
            return trip.getAiFeedback();
        }
        TripDetailDto tripDetail = getTripDetail(tripId, username);
        String feedback = aiService.getTripFeedback(tripDetail);
        trip.setAiFeedback(feedback);

        return feedback;
    }
}

package org.example.gam.controller;

import lombok.RequiredArgsConstructor;
import org.example.gam.dto.travel.*;
import org.example.gam.service.AiService;
import org.example.gam.service.CalendarService;
import org.example.gam.service.TravelApiService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/api/v1/travel")
@RequiredArgsConstructor
public class TravelController {

    private final TravelApiService travelApiService;
    private final CalendarService calendarService;
    private final AiService aiService;

    @Value("${kakao.restapi.key}")
    private String kakaoApiKey;

    @GetMapping("/recommend")
    public String openRecommendPage() {
        return "recommend";
    }

    @GetMapping("/search")
    public String searchPage(Model model){
        model.addAttribute("Kakao_API", kakaoApiKey);
        return "search";
    }

    @GetMapping("/restaurants")
    public ResponseEntity<List<TravelSearchResponse.Item>> getRestaurants(@RequestParam String region) {
        String query = region + " 맛집";
        List<TravelSearchResponse.Item> result = travelApiService.searchLocal(query);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/attractions")
    public ResponseEntity<List<TravelSearchResponse.Item>> getAttractions(@RequestParam String region) {
        String query = region + " 가볼만한곳";
        List<TravelSearchResponse.Item> result = travelApiService.searchLocal(query);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/hotels")
    public ResponseEntity<List<TravelSearchResponse.Item>> getHotels(@RequestParam String region) {
        String query = region + " 숙소";
        List<TravelSearchResponse.Item> result = travelApiService.searchLocal(query);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/recommend")
    public ResponseEntity<RecommendResponseDto> recommendRegion(@RequestBody RecommendRequestDto request){
        RecommendResponseDto response = travelApiService.getRecommendationFromAI(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/trips/{tripId}/schedules")
    public ResponseEntity<String> createSchedule(
            @PathVariable Long tripId,
            Authentication authentication,
            @RequestBody ScheduleRequestDto requestDto){

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        String email = authentication.getName();
        calendarService.addSchedule(tripId, email, requestDto);

        return ResponseEntity.ok("일정이 성공적으로 추가되었습니다!");
    }

    @GetMapping("/trips")
    public ResponseEntity<List<TripResponseDto>> getMyTrips(Authentication authentication) {
        String email = authentication.getName();
        List<TripResponseDto> tripList = calendarService.getUserTrips(email);

        return ResponseEntity.ok(tripList);
    }

    @PostMapping("/trips")
    public ResponseEntity<Long> createTrip(Authentication authentication, @RequestBody TripRequestDto dto) {
        String email = authentication.getName();
        Long tripId = calendarService.createTrip(email, dto);
        return ResponseEntity.ok(tripId);
    }

    @GetMapping("/trips/{tripId}")
    public ResponseEntity<TripDetailDto> getTripDetail(
            @PathVariable Long tripId,
            Authentication authentication) {
        String email = authentication.getName();
        TripDetailDto tripDetail = calendarService.getTripDetail(tripId, email);
        return ResponseEntity.ok(tripDetail);
    }

    @DeleteMapping("/trips/{tripId}")
    public ResponseEntity<String> deleteTrip(
            @PathVariable Long tripId,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        String email = authentication.getName();
        calendarService.deleteTrip(tripId, email);

        return ResponseEntity.ok("여행이 성공적으로 삭제되었습니다.");
    }

    @DeleteMapping("/trips/{tripId}/schedules/{scheduleId}")
    public ResponseEntity<String> deleteSchedule(
            @PathVariable Long tripId,
            @PathVariable Long scheduleId,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        String email = authentication.getName();
        calendarService.deleteSchedule(tripId, scheduleId, email);

        return ResponseEntity.ok("일정이 성공적으로 삭제되었습니다.");
    }


    @GetMapping("/trip-create")
    public String createTripPage() {
        return "create-trip";
    }

    @GetMapping("/keyword")
    public ResponseEntity<List<TravelSearchResponse.Item>> getKeywordSearch(@RequestParam String query) {
        List<TravelSearchResponse.Item> result = travelApiService.searchKeyword(query);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/feedback/trips/{tripId}")
    public ResponseEntity<String> getTripFeedback(
            @PathVariable Long tripId,
            Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }
        String email = authentication.getName();

        String feedback = calendarService.getTripFeedback(tripId, email);

        return ResponseEntity.ok(feedback);
    }
}

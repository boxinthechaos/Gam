package org.example.gam.controller;

import lombok.RequiredArgsConstructor;
import org.example.gam.dto.RecommendRequestDto;
import org.example.gam.dto.RecommendResponseDto;
import org.example.gam.dto.TravelSearchResponse;
import org.example.gam.service.TravelApiService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/api/v1/travel")
@RequiredArgsConstructor
public class TravelController {

    private final TravelApiService travelApiService;

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
}

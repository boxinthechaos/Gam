package org.example.gam.service;

import lombok.RequiredArgsConstructor;
import org.example.gam.dto.RecommendRequestDto;
import org.example.gam.dto.RecommendResponseDto;
import org.example.gam.dto.TravelSearchResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.HtmlUtils;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TravelApiService {

    @Value("${naver.client.id}")
    private String clientId;

    @Value("${naver.client.secret}")
    private String clientSecret;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<TravelSearchResponse.Item> searchLocal(String query){

        String url = "https://openapi.naver.com/v1/search/local.json?query={query}&display=5";

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Naver-Client-Id", clientId);
        headers.set("X-Naver-Client-Secret", clientSecret);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<TravelSearchResponse> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                TravelSearchResponse.class,
                query
        );

        if (response.getBody() != null && response.getBody().getItems() != null) {
            List<TravelSearchResponse.Item> items = response.getBody().getItems();

            for (TravelSearchResponse.Item item : items) {
                String cleanTitle = item.getTitle().replaceAll("<[^>]*>", "");
                cleanTitle = HtmlUtils.htmlUnescape(cleanTitle);
                item.setTitle(cleanTitle);
                String encodedTitle = URLEncoder.encode(cleanTitle, StandardCharsets.UTF_8);

                String customBookingUrl = "https://www.yanolja.com/search/" + encodedTitle;
                item.setBookingUrl(customBookingUrl);
            }
            return items;
        }

        return Collections.emptyList();
    }

    public RecommendResponseDto getRecommendationFromAI(RecommendRequestDto dto){
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey;
        String prompt = String.format(
                "너는 한국 최고의 1타 여행 가이드야. 유저가 '%s'와 함께, '%s' 풍경을 보며, '%s' 스타일의 '%s' 여행을 하고 싶어해. " +
                        "이 조건에 가장 완벽하게 어울리는 국내 여행지(도시 이름, 예: 강릉, 부산, 경주) 딱 1곳을 추천해 줘. " +
                        "이유는 감성적이고 설득력 있게 2~3줄로 작성해 줘. " +
                        "반드시 아래 JSON 형식으로만 대답하고, 마크다운 기호나 다른 설명은 일절 추가하지 마: " +
                        "{\"recommendedRegion\": \"도시이름\", \"reason\": \"추천하는 이유\"}",
                dto.getCompanion(), dto.getScenery(), dto.getStyle(), dto.getTransport()
        );

        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", prompt);

        Map<String, Object> parts = new HashMap<>();
        parts.put("parts", List.of(textPart));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(parts));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try{
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            JsonNode rootNode = objectMapper.readTree(response.getBody());
            String aiAnswer = rootNode.path("candidates").get(0)
                    .path("content").path("parts").get(0)
                    .path("text").asText();
            aiAnswer = aiAnswer.replace("```json", "").replace("```", "").trim();

            return objectMapper.readValue(aiAnswer, RecommendResponseDto.class);
        } catch (Exception e) {
            e.printStackTrace();
            return new RecommendResponseDto("제주도", "AI가 잠시 혼란에 빠졌지만, 언제 가도 완벽한 제주도를 추천합니다!");
        }
    }
}

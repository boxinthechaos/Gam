package org.example.gam.service;

import lombok.RequiredArgsConstructor;
import org.example.gam.dto.travel.ScheduleResponseDto;
import org.example.gam.dto.travel.TripDetailDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public String getTripFeedback(TripDetailDto tripDetail) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("다음은 나의 '").append(tripDetail.getTitle()).append("' 여행 일정이야.\n");
        prompt.append("기간: ").append(tripDetail.getStartDate()).append(" ~ ").append(tripDetail.getEndDate()).append("\n\n");
        prompt.append("[일정 목록]\n");

        for (ScheduleResponseDto schedule : tripDetail.getSchedules()) {
            prompt.append("- 날짜: ").append(schedule.getVisitDate())
                    .append(", 시간: ").append(schedule.getStartTime()).append("~").append(schedule.getEndTime())
                    .append(", 장소: ").append(schedule.getPlaceName())
                    .append(", 카테고리: ").append(schedule.getCategory()).append("\n");
        }

        prompt.append("\n위 일정을 보고 다음 항목들에 대해 친절한 여행 가이드처럼 답변해줘:\n");
        prompt.append("1. 일정의 동선이나 시간 분배에서 개선할 점이 있을까?\n");
        prompt.append("2. 각 장소 근처에서 추가로 방문하기 좋은 추천 장소나 맛집을 2~3개 추천해줘.\n");
        prompt.append("3. 이 여행의 전체적인 팁을 간단히 알려줘.");

        return callGeminiApi(prompt.toString());
    }

    private String callGeminiApi(String prompt) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=" + geminiApiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", prompt);

        Map<String, Object> parts = new HashMap<>();
        parts.put("parts", List.of(textPart));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(parts));

        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("temperature", 0.7);
        requestBody.put("generationConfig", generationConfig);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        int maxRetries = 3;
        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

                JsonNode rootNode = objectMapper.readTree(response.getBody());
                return rootNode.path("candidates").get(0)
                        .path("content").path("parts").get(0)
                        .path("text").asText();

            } catch (HttpServerErrorException e) {
                if (e.getStatusCode().value() == 503 && attempt < maxRetries) {
                    try { Thread.sleep(2000L * attempt); } catch (InterruptedException ie) { Thread.currentThread().interrupt(); }
                } else {
                    return "❌ AI 서버가 혼잡합니다. 잠시 후 다시 시도해주세요.";
                }
            } catch (Exception e) {
                e.printStackTrace();
                return "❌ AI 피드백을 가져오는 중 오류가 발생했습니다.";
            }
        }
        return "❌ 재시도 횟수를 초과했습니다.";
    }
}
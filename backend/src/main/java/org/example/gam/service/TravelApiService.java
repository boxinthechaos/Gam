package org.example.gam.service;

import lombok.RequiredArgsConstructor;
import org.example.gam.dto.travel.RecommendRequestDto;
import org.example.gam.dto.travel.RecommendResponseDto;
import org.example.gam.dto.travel.TravelSearchResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.HtmlUtils;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.ConcurrentLinkedDeque;

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

    private final Deque<String> recentRegions = new ConcurrentLinkedDeque<>();
    private static final int MAX_HISTORY = 3;

    public List<TravelSearchResponse.Item> searchLocal(String query){
        String[] suffixes;
        if (query.contains("맛집")) {
            suffixes = new String[]{"식당", "맛집", "음식점", "밥집", "카페", "브런치", "포장마차", "분식"};
        } else if (query.contains("숙소")) {
            suffixes = new String[]{"숙소", "펜션", "호텔", "게스트하우스", "리조트", "모텔", "민박", "캠핑장"};
        } else {
            suffixes = new String[]{"관광지", "명소", "가볼만한곳", "여행지", "공원", "박물관", "전시관", "축제", "체험"};
        }

        String baseQuery = query
                .replace("맛집", "")
                .replace("가볼만한곳", "")
                .replace("숙소", "")
                .trim();

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Naver-Client-Id", clientId);
        headers.set("X-Naver-Client-Secret", clientSecret);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        List<String> shuffledSuffixes = new java.util.ArrayList<>(List.of(suffixes));
        Collections.shuffle(shuffledSuffixes);

        List<TravelSearchResponse.Item> allItems = new java.util.ArrayList<>();

        for (String suffix : shuffledSuffixes) {
            if (allItems.size() >= 20) break;

            String enrichedQuery = baseQuery + " " + suffix;
            int randomStart = (int)(Math.random() * 4) * 20 + 1;
            String url = "https://openapi.naver.com/v1/search/local.json?query={query}&display=20&start=" + randomStart;

            try {
                ResponseEntity<TravelSearchResponse> response = restTemplate.exchange(
                        url, HttpMethod.GET, entity, TravelSearchResponse.class, enrichedQuery
                );

                if (response.getBody() != null && response.getBody().getItems() != null) {
                    List<TravelSearchResponse.Item> items = response.getBody().getItems();

                    for (TravelSearchResponse.Item item : items) {
                        String cleanTitle = item.getTitle().replaceAll("<[^>]*>", "");
                        cleanTitle = HtmlUtils.htmlUnescape(cleanTitle);
                        item.setTitle(cleanTitle);
                        String encodedTitle = URLEncoder.encode(cleanTitle, StandardCharsets.UTF_8);
                        String pageKey = String.valueOf(System.currentTimeMillis());
                        item.setLink("https://map.naver.com/p/search/" + encodedTitle);
                        item.setBookingUrl("https://nol.yanolja.com/discovery/s/results"
                                + "?filter=AVAILABLE_ONLY%3DAVAILABLE_ONLY"
                                + "&keyword=" + encodedTitle
                                + "&category=local"
                                + "&pageKey=" + pageKey);
                    }
                    allItems.addAll(items);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        java.util.Set<String> seen = new java.util.HashSet<>();
        List<TravelSearchResponse.Item> deduped = allItems.stream()
                .filter(item -> seen.add(item.getTitle()))
                .collect(java.util.stream.Collectors.toList());

        Collections.shuffle(deduped);
        return deduped.stream().limit(5).toList();
    }

    public RecommendResponseDto getRecommendationFromAI(RecommendRequestDto dto){
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey;
        String excludeRegions = String.join(", ", recentRegions);
        String prompt = String.format(
                "너는 한국 최고의 1타 여행 가이드야. 유저가 '%s'와 함께, '%s' 풍경을 보며, '%s' 스타일의 '%s' 여행을 하고 싶어해. " +
                        "이 조건에 가장 완벽하게 어울리는 국내 여행지(도시 이름, 예: 강릉, 부산, 경주) 딱 1곳을 추천해 줘. " +
                        "이유는 감성적이고 설득력 있게 2~3줄로 작성해 줘. " +
                        "★중요★ 최근에 추천했던 지역인 [%s] 지역은 절대 중복해서 추천하지 마. 반드시 다른 새로운 지역을 찾아봐! " +
                        "반드시 아래 JSON 형식으로만 대답하고, 마크다운 기호나 다른 설명은 일절 추가하지 마: " +
                        "{\"recommendedRegion\": \"도시이름\", \"reason\": \"추천하는 이유\"}",
                dto.getCompanion(), dto.getScenery(), dto.getStyle(), dto.getTransport(), excludeRegions
        );

        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", prompt);

        Map<String, Object> parts = new HashMap<>();
        parts.put("parts", List.of(textPart));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(parts));

        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("temperature", 0.9);
        requestBody.put("generationConfig", generationConfig);

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

            RecommendResponseDto responseDto = objectMapper.readValue(aiAnswer, RecommendResponseDto.class);

            if (responseDto.getRecommendedRegion() != null) {
                recentRegions.addLast(responseDto.getRecommendedRegion());
                // 기억력이 MAX_HISTORY(3개)를 넘어가면 제일 오래된 기억 삭제 (다시 추천될 수 있게 됨)
                if (recentRegions.size() > MAX_HISTORY) {
                    recentRegions.removeFirst();
                }
            }

            return responseDto;
            
        } catch (Exception e) {
            e.printStackTrace();
            return new RecommendResponseDto("제주도", "AI가 잠시 혼란에 빠졌지만, 언제 가도 완벽한 제주도를 추천합니다!");
        }
    }

    public List<TravelSearchResponse.Item> searchKeyword(String query) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Naver-Client-Id", clientId);
        headers.set("X-Naver-Client-Secret", clientSecret);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        List<TravelSearchResponse.Item> resultItems = new java.util.ArrayList<>();
        // 정확한 검색을 위해 suffix를 붙이지 않고 검색어 그대로 요청합니다. (상위 5개만)
        String url = "https://openapi.naver.com/v1/search/local.json?query={query}&display=5&start=1";

        try {
            ResponseEntity<TravelSearchResponse> response = restTemplate.exchange(
                    url, HttpMethod.GET, entity, TravelSearchResponse.class, query
            );

            if (response.getBody() != null && response.getBody().getItems() != null) {
                List<TravelSearchResponse.Item> items = response.getBody().getItems();

                for (TravelSearchResponse.Item item : items) {
                    String cleanTitle = item.getTitle().replaceAll("<[^>]*>", "");
                    cleanTitle = HtmlUtils.htmlUnescape(cleanTitle);
                    item.setTitle(cleanTitle);
                    String encodedTitle = URLEncoder.encode(cleanTitle, StandardCharsets.UTF_8);

                    item.setLink("https://map.naver.com/p/search/" + encodedTitle);
                }
                resultItems.addAll(items);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return resultItems;
    }
}
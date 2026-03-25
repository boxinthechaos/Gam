package org.example.gam.service;

import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.model.SearchListResponse;
import com.google.api.services.youtube.model.SearchResult;
import com.google.api.services.youtube.model.Video;
import com.google.api.services.youtube.model.VideoListResponse;
import lombok.RequiredArgsConstructor;
import org.example.gam.dto.SongResponseDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlaylistService {

    @Value("${youtube.api-key}")
    private final String youtubeApiKey;

    private final YouTube youtube;

    public PlaylistService(YouTube youtube, @Value("${youtube.api-key}") String youtubeApiKey) {
        this.youtube = youtube;
        this.youtubeApiKey = youtubeApiKey;
        System.out.println("✅ [서버 실행] 주입된 유튜브 API 키: " + this.youtubeApiKey);
    }

    public List<SongResponseDto> recommendPlayListByTime(int targetMinutes, String genre) {
        long targetDurationMs = targetMinutes * 60 * 1000L;
        long currentDurationMs = 0L;
        List<SongResponseDto> playList = new ArrayList<>();

        try{
            YouTube.Search.List searchRequest = youtube.search().list(List.of("id", "snippet"));
            SearchListResponse searchResponse = searchRequest.setKey(youtubeApiKey) // 여기서 더 이상 null이 아닐 겁니다!
                    .setQ(genre + "official MV")
                    .setType(List.of("video"))
                    .setVideoCategoryId("10")
                    .setMaxResults(50L)
                    .execute();

            List<SearchResult> searchResults = searchResponse.getItems();
            if(searchResults == null || searchResults.isEmpty()){
                return playList;
            }
            List<String> videoIds = searchResults.stream()
                    .map(result -> result.getId().getVideoId())
                    .toList();
            YouTube.Videos.List videoRequest = youtube.videos().list(List.of("contentDetails", "snippet"));
            VideoListResponse videoResponse = videoRequest.setKey(youtubeApiKey)
                    .setId(videoIds)
                    .execute();

            List<Video> videos = videoResponse.getItems();

            for(Video video : videos){
                String videoId = video.getId();
                String youtubeUrl = "https://www.youtube.com/watch?v=" + videoId;

                String durationIso = video.getContentDetails().getDuration();
                long trackDuration = Duration.parse(durationIso).toMillis();

                if (trackDuration < 120000 || trackDuration > 360000) {
                    continue;
                }

                if (currentDurationMs + trackDuration <= targetDurationMs + 60000) {
                    String title = video.getSnippet().getTitle();
                    String artistName = video.getSnippet().getChannelTitle();

                    playList.add(new SongResponseDto(title, artistName, trackDuration, youtubeUrl));
                    currentDurationMs += trackDuration;
                }

                if (currentDurationMs >= targetDurationMs - 60000) {
                    break;
                }
            }
        }catch (Exception e) {
            System.err.println("❌ 유튜브 노래 불러오기 실패: " + e.getMessage());
            e.printStackTrace();
        }
        return playList;
    }
}

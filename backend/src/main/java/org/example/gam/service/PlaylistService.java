package org.example.gam.service;

import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.model.SearchListResponse;
import com.google.api.services.youtube.model.SearchResult;
import com.google.api.services.youtube.model.Video;
import com.google.api.services.youtube.model.VideoListResponse;
import org.example.gam.Repository.PlaylistRepository;
import org.example.gam.Repository.UserRepository;
import org.example.gam.dto.PlaylistSaveRequestDto;
import org.example.gam.dto.SongResponseDto;
import org.example.gam.entitiy.Playlist;
import org.example.gam.entitiy.Song;
import org.example.gam.entitiy.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlaylistService {

    @Value("${youtube.api-key}")
    private final String youtubeApiKey;

    private final YouTube youtube;
    private final PlaylistRepository playlistRepository;
    private final UserRepository userRepository;

    public PlaylistService(YouTube youtube, @Value("${youtube.api-key}") String youtubeApiKey,
                           PlaylistRepository playlistRepository, UserRepository userRepository) {
        this.youtube = youtube;
        this.youtubeApiKey = youtubeApiKey;
        this.playlistRepository = playlistRepository;
        this.userRepository = userRepository;
    }

    public List<SongResponseDto> recommendPlayListByTime(int targetMinutes, String genre) {
        long targetDurationMs = targetMinutes * 60 * 1000L;
        long currentDurationMs = 0L;
        List<SongResponseDto> playList = new ArrayList<>();

        String[] suffixes = {"Official MV", "Official Audio", "Official Music Video"};

        String antiAiQuery = " -ai -cover -sunu -udio -plink -fanmade";

        try {
            List<Video> allVideos = new ArrayList<>();
            List<String> shuffledSuffixes = new ArrayList<>(List.of(suffixes));
            Collections.shuffle(shuffledSuffixes);

            for (String suffix : shuffledSuffixes) {
                YouTube.Search.List searchRequest = youtube.search().list(List.of("id", "snippet"));
                SearchListResponse searchResponse = searchRequest
                        .setKey(youtubeApiKey)
                        .setQ(genre + " " + suffix + antiAiQuery)
                        .setType(List.of("video"))
                        .setVideoCategoryId("10")
                        .setOrder("relevance")
                        .setMaxResults(50L)
                        .execute();

                List<SearchResult> searchResults = searchResponse.getItems();
                if (searchResults == null || searchResults.isEmpty()) continue;

                List<String> videoIds = searchResults.stream()
                        .map(result -> result.getId().getVideoId())
                        .toList();

                YouTube.Videos.List videoRequest = youtube.videos().list(List.of("contentDetails", "snippet", "topicDetails"));
                VideoListResponse videoResponse = videoRequest
                        .setKey(youtubeApiKey)
                        .setId(videoIds)
                        .execute();

                if (videoResponse.getItems() != null) {
                    allVideos.addAll(videoResponse.getItems());
                }
            }

            java.util.Set<String> seen = new java.util.HashSet<>();
            List<Video> dedupedVideos = allVideos.stream()
                    .filter(v -> seen.add(v.getId()))
                    .collect(Collectors.toList());
            Collections.shuffle(dedupedVideos);

            for (Video video : dedupedVideos) {
                String title = video.getSnippet().getTitle().toLowerCase();
                String channelTitle = video.getSnippet().getChannelTitle().toLowerCase();

                if (title.contains("ai") || title.contains("cover") || title.contains("fanmade")) continue;

                boolean isOfficial = title.contains("official") ||
                        channelTitle.contains("official") ||
                        channelTitle.contains("vevo") ||
                        channelTitle.endsWith("- topic");

                if (!isOfficial) continue;

                String durationIso = video.getContentDetails().getDuration();
                long trackDuration = Duration.parse(durationIso).toMillis();

                if (trackDuration < 120000 || trackDuration > 360000) continue;

                if (currentDurationMs + trackDuration <= targetDurationMs + 60000) {
                    playList.add(new SongResponseDto(
                            video.getSnippet().getTitle(),
                            video.getSnippet().getChannelTitle(),
                            trackDuration,
                            "https://www.youtube.com/watch?v=" + video.getId()
                    ));
                    currentDurationMs += trackDuration;
                }

                if (currentDurationMs >= targetDurationMs - 30000) break;
            }

        } catch (Exception e) {
            System.err.println("❌ 노래 로드 중 오류: " + e.getMessage());
        }
        return playList;
    }

    @Transactional
    public void savePlayList(PlaylistSaveRequestDto request, String email){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("유저가 존재하지 않습니다"));

        Playlist playlist = new Playlist();
        playlist.setTitle(request.getTitle());
        playlist.setUser(user);

        for (SongResponseDto songDto : request.getSongs()) {
            Song song = new Song();
            song.setTitle(songDto.getTitle());
            song.setArtistName(songDto.getArtist());
            song.setTrackDuration(songDto.getDurationMs());
            song.setYoutubeUrl(songDto.getYoutubeUrl());
            playlist.addSong(song);
        }
        playlistRepository.save(playlist);
    }
}
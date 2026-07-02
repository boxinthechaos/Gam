package org.example.gam.service;

import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.model.SearchListResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.gam.Repository.PlaylistRepository;
import org.example.gam.Repository.UserRepository;
import org.example.gam.dto.music.PlaylistResponseDto;
import org.example.gam.dto.music.PlaylistSaveRequestDto;
import org.example.gam.dto.music.SongResponseDto;
import org.example.gam.entitiy.Playlist;
import org.example.gam.entitiy.Song;
import org.example.gam.entitiy.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.model_objects.credentials.ClientCredentials;
import se.michaelthelin.spotify.model_objects.specification.Paging;
import se.michaelthelin.spotify.model_objects.specification.Track;
import se.michaelthelin.spotify.requests.authorization.client_credentials.ClientCredentialsRequest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PlaylistService {
    private final SpotifyApi spotifyApi;
    private final UserRepository userRepository;
    private final PlaylistRepository playlistRepository;
    private final YouTube youtube;

    @Value("${youtube.api.key}")
    private String apiKey;

    private void refreshAccessToken() throws Exception{
        ClientCredentialsRequest request = spotifyApi.clientCredentials().build();
        ClientCredentials clientCredentials = request.execute();
        spotifyApi.setAccessToken(clientCredentials.getAccessToken());
    }

    public List<SongResponseDto> recommendPlayListByTime(int targetMinutes, String keyword){
        if (keyword == null || keyword.trim().isEmpty()) {
            System.out.println("❌ 검색어가 입력되지 않았습니다.");
            return new ArrayList<>();
        }

        long targetDurationMs = targetMinutes * 60 * 1000L;
        long currentDurationMs = 0L;
        List<SongResponseDto> playlist = new ArrayList<>();

        try {
            refreshAccessToken();
            List<Track> allTracks = new ArrayList<>();

            List<String> keywordList = Arrays.stream(keyword.split(","))
                    .map(String::trim)
                    .toList();

            for (String k : keywordList) {
                    String query = k;

                int[] offsets = {0, 20, 40, 60};
                for (int offset : offsets) {
                    try {
                        Paging<Track> tracks = spotifyApi
                                .searchTracks(query)
                                .offset(offset)
                                .build()
                                .execute();

                        if (tracks.getItems() != null) {
                            allTracks.addAll(List.of(tracks.getItems()));
                        }
                    } catch (Exception e) {
                        System.out.println("❌ " + k + " 검색 중 일부 오류 발생 (무시하고 계속 진행): " + e.getMessage());
                    }
                }
            }

            Collections.shuffle(allTracks);

            for (Track track : allTracks) {
                long trackDuration = track.getDurationMs();

                if (trackDuration < 120000) continue;

                // 가수 이름 정확히 일치하는 곡만 필터링
                boolean isExactMatch = false;
                for (var artist : track.getArtists()) {
                    for (String k : keywordList) {
                        if (artist.getName().equalsIgnoreCase(k)) {
                            isExactMatch = true;
                            break;
                        }
                    }
                    if (isExactMatch) break;
                }
                if (!isExactMatch) continue;

                if (currentDurationMs + trackDuration <= targetDurationMs + 150000) {
                    playlist.add(new SongResponseDto(
                            track.getName(),
                            track.getArtists()[0].getName(),
                            trackDuration,
                            track.getExternalUrls().get("spotify")
                    ));
                    currentDurationMs += trackDuration;
                }

                if (currentDurationMs >= targetDurationMs - 60000) break;
            }

        } catch (Exception e) {
            System.out.println("❌ 노래 로드 중 오류: " + e.getMessage());
        }
        return playlist;
    }

    @Transactional
    public void savePlayList(PlaylistSaveRequestDto requestDto, String userEmail){
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저를 찾을 수 없습니다"));

        Playlist playlist = new Playlist();
        playlist.setTitle(requestDto.getTitle());
        playlist.setUser(user);

        if(requestDto.getSongs() != null){
            for (SongResponseDto songDto : requestDto.getSongs()) {
                Song song = new Song();
                song.setTitle(songDto.getTitle());
                song.setArtistName(songDto.getArtist());
                song.setTrackDuration(songDto.getDurationMs());
                song.setSpotifyUrl(songDto.getSpotifyUrl());

                // 🔥 유튜브 비디오 ID 검색 및 저장
                String query = songDto.getArtist() + " " + songDto.getTitle();
                String videoId = searchYoutubeVideoId(query);
                song.setYoutubeVideoId(videoId);

                playlist.addSong(song);
            }
            playlistRepository.save(playlist);
        }
    }

    public List<PlaylistResponseDto> getMyPlaylists(String userEmail){
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저를 찾을 수 없습니다"));
        List<Playlist> playlists = playlistRepository.findByUser(user);
        return playlists.stream()
                .map(playlist -> new PlaylistResponseDto(
                        playlist.getId(),
                        playlist.getTitle(),
                        playlist.getSongs().stream()
                                .map(song -> new SongResponseDto(
                                        song.getTitle(),
                                        song.getArtistName(),
                                        song.getTrackDuration(),
                                        song.getSpotifyUrl()
                                )).toList()
                )).toList();
    }

    public void deletePlaylist(Long PlaylistId, String userEmail){
        Playlist playlist = playlistRepository.findById(PlaylistId)
                .orElseThrow(() -> new IllegalArgumentException("해당 플레이리스트가 존재하지 않습니다"));

        if(!playlist.getUser().getEmail().equals(userEmail)){
            throw new IllegalStateException("삭제 권한이 없습니다.");
        }

        playlistRepository.delete(playlist);
    }

    public String getYoutubeUrlFromPlaylist(Long playlistId, String userEmail) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new IllegalArgumentException("플레이리스트가 존재하지 않습니다."));

        if (!playlist.getUser().getEmail().equals(userEmail)) {
            throw new IllegalStateException("권한이 없습니다.");
        }

        List<String> videoIds = new ArrayList<>();
        for (Song song : playlist.getSongs()) {
            if (song.getYoutubeVideoId() != null && !song.getYoutubeVideoId().isEmpty()) {
                videoIds.add(song.getYoutubeVideoId());
            }
        }

        if (videoIds.isEmpty()) {
            return "검색 결과가 없습니다.";
        }

        return "https://www.youtube.com/watch_videos?video_ids=" + String.join(",", videoIds);
    }

    private String searchYoutubeVideoId(String query) {
        try {
            SearchListResponse response = youtube.search()
                    .list(Collections.singletonList("id"))
                    .setQ(query)
                    .setKey(apiKey)
                    .setType(Collections.singletonList("video"))
                    .setMaxResults(1L)
                    .setFields("items(id(videoId))") // 필요한 필드만 가져와서 속도 향상
                    .execute();

            if (response.getItems() != null && !response.getItems().isEmpty()) {
                return response.getItems().get(0).getId().getVideoId();
            }
        } catch (Exception e) {
            System.err.println("❌ 유튜브 검색 중 오류 발생: " + query + " -> " + e.getMessage());
        }
        return null;
    }

    public String getYoutubeUrlFromDtoList(List<SongResponseDto> songs) {
        List<String> videoIds = new ArrayList<>();
        for (SongResponseDto song : songs) {
            String videoId = searchYoutubeVideoId(song.getArtist() + " " + song.getTitle());
            if (videoId != null) videoIds.add(videoId);
        }
        return videoIds.isEmpty() ? "" : "https://www.youtube.com/watch_videos?video_ids=" + String.join(",", videoIds);
    }

    public SongResponseDto replaceSong(String keyword, List<String> excludeTitles){
        if (keyword == null || keyword.trim().isEmpty()) {
            System.out.println("❌ 검색어가 입력되지 않았습니다.");
            return null;
        }
        List<SongResponseDto> playlist = new ArrayList<>();

        try {
            refreshAccessToken();
            List<Track> allTracks = new ArrayList<>();

            List<String> keywordList = Arrays.stream(keyword.split(","))
                    .map(String::trim)
                    .toList();

            for (String k : keywordList) {
                String query = k;

                int[] offsets = {0, 20, 40, 60};
                for (int offset : offsets) {
                    try {
                        Paging<Track> tracks = spotifyApi
                                .searchTracks(query)
                                .offset(offset)
                                .build()
                                .execute();

                        if (tracks.getItems() != null) {
                            allTracks.addAll(List.of(tracks.getItems()));
                        }
                    } catch (Exception e) {
                        System.out.println("❌ " + k + " 검색 중 일부 오류 발생 (무시하고 계속 진행): " + e.getMessage());
                    }
                }
            }

            Collections.shuffle(allTracks);

            for (Track track : allTracks) {
                long trackDuration = track.getDurationMs();

                if (trackDuration < 120000) continue;

                // 가수 이름 정확히 일치하는 곡만 필터링
                boolean isExactMatch = false;
                for (var artist : track.getArtists()) {
                    for (String k : keywordList) {
                        if (artist.getName().equalsIgnoreCase(k)) {
                            isExactMatch = true;
                            break;
                        }
                    }
                    if (isExactMatch) break;
                }
                if (!isExactMatch) continue;

                // 이미 플레이리스트에 있는 곡 제외
                if (excludeTitles.contains(track.getName())) continue;

                // 조건 맞는 첫 번째 곡 1개만 반환
                return new SongResponseDto(
                        track.getName(),
                        track.getArtists()[0].getName(),
                        trackDuration,
                        track.getExternalUrls().get("spotify")
                );
            }

        } catch (Exception e) {
            System.out.println("❌ 노래 로드 중 오류: " + e.getMessage());
        }
        return null;
    }
}
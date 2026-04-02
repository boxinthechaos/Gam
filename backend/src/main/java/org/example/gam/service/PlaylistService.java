package org.example.gam.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.gam.Repository.PlaylistRepository;
import org.example.gam.Repository.UserRepository;
import org.example.gam.dto.PlaylistSaveRequestDto;
import org.example.gam.dto.SongResponseDto;
import org.example.gam.entitiy.Playlist;
import org.example.gam.entitiy.Song;
import org.example.gam.entitiy.User;
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

    private void refreshAccessToken() throws Exception{
        ClientCredentialsRequest request = spotifyApi.clientCredentials().build();
        ClientCredentials clientCredentials = request.execute();
        spotifyApi.setAccessToken(clientCredentials.getAccessToken());
    }

    public List<SongResponseDto> recommendPlayListByTime(int targetMinutes, String searchType, String keyword){
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

            String query;
            for (String k : keywordList) {
                if (searchType != null && !searchType.isBlank()) {
                    query = searchType + ":" + k;
                } else {
                    query = k;
                }

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

                if ("artist".equals(searchType)) {
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
                }

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
                playlist.addSong(song);
        }

            playlistRepository.save(playlist);
        }
    }
}
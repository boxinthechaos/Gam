package org.example.gam.dto.music;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SongResponseDto {
    private String title;
    private String artist;
    private long durationMs;
    private String spotifyUrl;

    public SongResponseDto(String title, String artist, long durationMs, String spotifyUrl) {
        this.title = title;
        this.artist = artist;
        this.durationMs = durationMs;
        this.spotifyUrl = spotifyUrl;

    }
}

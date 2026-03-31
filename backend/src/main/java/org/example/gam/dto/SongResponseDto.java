package org.example.gam.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SongResponseDto {
    private String title;
    private String artist;
    private long durationMs;
    private String youtubeUrl;

    public SongResponseDto(String title, String artist, long durationMs, String youtubeUrl) {
        this.title = title;
        this.artist = artist;
        this.durationMs = durationMs;
        this.youtubeUrl = youtubeUrl;

    }
}

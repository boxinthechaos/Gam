package org.example.gam.controller;

import lombok.RequiredArgsConstructor;
import org.example.gam.dto.SongResponseDto;
import org.example.gam.service.PlaylistService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Controller
@RequestMapping("/api/v1/music")
@RequiredArgsConstructor
public class SongController {
    private final PlaylistService playlistService;

    @GetMapping("/recommend")
    public ResponseEntity<List<SongResponseDto>> recommendMusic(
            @RequestParam(defaultValue = "30") int minutes,
            @RequestParam(defaultValue = "K-POP") String genre){
        List<SongResponseDto> playList = playlistService.recommendPlayListByTime(minutes, genre);
        return ResponseEntity.ok(playList);
    }

    @GetMapping("/playlist")
    public String showPlaylistPage() {
        return "music";
    }
}

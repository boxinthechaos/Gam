package org.example.gam.controller;

import lombok.RequiredArgsConstructor;
import org.example.gam.dto.PlaylistSaveRequestDto;
import org.example.gam.dto.SongResponseDto;
import org.example.gam.service.PlaylistService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@Controller
@RequestMapping("/api/v1/music")
@RequiredArgsConstructor
public class SongController {
    private final PlaylistService playlistService;

    @GetMapping("/recommend")
    public ResponseEntity<List<SongResponseDto>> recommendMusic(
            @RequestParam(defaultValue = "30") int minutes,
            @RequestParam(defaultValue = "artist") String searchType,
            @RequestParam(defaultValue = "new jeans") String keyword) {
        List<SongResponseDto> playList = playlistService.recommendPlayListByTime(minutes, searchType, keyword);
        return ResponseEntity.ok(playList);
    }

    @GetMapping("/playlist")
    public String showPlaylistPage() {
        return "music";
    }

    @PostMapping("/save")
    public ResponseEntity<String> savePlaylist(
            @RequestBody PlaylistSaveRequestDto requestDto,
            Principal principal
            ){
        if(principal == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다");
        }

        String userEmail = principal.getName();

        try {
            playlistService.savePlayList(requestDto, userEmail);
            return ResponseEntity.ok("플레이리스트가 성공적으로 저장되었습니다!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("플레이리스트 저장 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}

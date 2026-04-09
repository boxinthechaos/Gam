package org.example.gam.controller;

import lombok.RequiredArgsConstructor;
import org.example.gam.dto.music.PlaylistResponseDto;
import org.example.gam.dto.music.PlaylistSaveRequestDto;
import org.example.gam.dto.music.SongResponseDto;
import org.example.gam.service.PlaylistService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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

    @GetMapping("/playlists")
    public ResponseEntity<List<PlaylistResponseDto>> getMyPlaylists(@AuthenticationPrincipal UserDetails userDetails) {
        String userEmail = userDetails.getUsername();
        List<PlaylistResponseDto> playlists = playlistService.getMyPlaylists(userEmail);
        return ResponseEntity.ok(playlists);
    }

    @DeleteMapping("/playlists/{id}")
    public ResponseEntity<Void> deletePlaylist(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        playlistService.deletePlaylist(id, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{playlistId}/youtube")
    public ResponseEntity<String> getYoutubePlaylist(@PathVariable Long playlistId,
                                                     @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String youtubeUrl = playlistService.getYoutubeUrlFromPlaylist(playlistId, userDetails.getUsername());
            return ResponseEntity.ok(youtubeUrl);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PostMapping("/youtube/preview")
    public ResponseEntity<String> getYoutubePreview(@RequestBody List<SongResponseDto> songDtos) {
        String youtubeUrl = playlistService.getYoutubeUrlFromDtoList(songDtos);

        if (youtubeUrl.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(youtubeUrl);
    }
}

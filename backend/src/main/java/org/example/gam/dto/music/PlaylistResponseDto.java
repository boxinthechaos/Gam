package org.example.gam.dto.music;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.stream.Collectors;
import org.example.gam.entitiy.Playlist;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PlaylistResponseDto {
    private Long id;
    private String title;
    private List<SongResponseDto> songs;
}

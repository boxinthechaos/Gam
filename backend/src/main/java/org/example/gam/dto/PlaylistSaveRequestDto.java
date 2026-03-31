package org.example.gam.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor  
public class PlaylistSaveRequestDto {
    private String title;
    private List<SongResponseDto> songs;
}

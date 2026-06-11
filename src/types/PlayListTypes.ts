export interface Song {
    title: string;
    artist: string;
    durationMs: number;
    spotifyUrl?: string;
}

export interface SavePlaylistForm {
    title: string;
    songs: Song[];
}
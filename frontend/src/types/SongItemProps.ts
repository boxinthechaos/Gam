import type { Song } from "./PlayListTypes";

export interface SongItemProps {
    index: number;
    song: Song;
    onReplace: (index: number) => void;
}
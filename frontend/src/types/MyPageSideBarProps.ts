import type { Trip, Playlist, SidebarView } from "./MyPageTypes";

export interface MyPageSideBarProps {
    trips: Trip[];
    playlists: Playlist[];
    selected: SidebarView | null;
    onSelect: (view: SidebarView) => void;
    onDeleteTrip: (id: number) => void;
    onDeletePlaylist: (id: number) => void;
    onCreateTrip: () => void;
}
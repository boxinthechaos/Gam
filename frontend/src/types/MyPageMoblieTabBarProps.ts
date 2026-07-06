import type { Trip, Playlist, SidebarView } from "./MyPageTypes";

export interface MyPageMobileTabBarProps {
    trips: Trip[];
    playlists: Playlist[];
    selected: SidebarView | null;
    onSelect: (view: SidebarView) => void;
}
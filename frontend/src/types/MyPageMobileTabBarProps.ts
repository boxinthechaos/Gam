import type { Trip } from "./MyPageTypes";
import type { Playlist } from "./MyPageTypes";
import type { SidebarView } from "./MyPageTypes";

export interface MyPageMobileTabBarProps {
    trips: Trip[];
    playlists: Playlist[];
    selected: SidebarView | null;
    onSelect: (view: SidebarView) => void;
}
import type { SidebarView } from "./MyPageTypes";

export interface MyPageMainPanelProps {
    selected: SidebarView | null;
    onCreateTrip: () => void;
}
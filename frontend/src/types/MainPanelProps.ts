import type { SidebarView } from "./MyPageTypes";

export interface MainPanelProps {
    selected: SidebarView | null;
    onCreateTrip: () => void;
}

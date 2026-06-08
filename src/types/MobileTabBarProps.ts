import type { MobileTab } from "../pages/SearchPage";

export interface MobileTabBarProps {
    mobileTab: MobileTab;
    addedCount: number;
    onChange: (tab: MobileTab) => void;
}
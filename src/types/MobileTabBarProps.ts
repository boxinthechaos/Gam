import type { MobileTab } from "../pages/Search";

export interface MobileTabBarProps {
    mobileTab: MobileTab;
    addedCount: number;
    onChange: (tab: MobileTab) => void;
}
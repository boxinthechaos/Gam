import type { MobileTab } from "../pages/Search";

export interface SearchMobileTabBarProps {
    mobileTab: MobileTab;
    addedCount: number;
    onChange: (tab: MobileTab) => void;
}
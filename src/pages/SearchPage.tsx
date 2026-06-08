import { useState } from "react";

import { usePlaceSearch } from "../hooks/usePlaceSearch";

import type { Category, Place } from "../types/SearchTypes";

import Navbar from "../components/main-page/Navbar";
import SidePanel from "../components/search/SidePanel";
import MapView from "../components/search/MapView";
import ScheduleBar from "../components/search/ScheduleBar";
import MobileTabBar from "../components/search/MobileTabBar";

export type MobileTab = "list" | "map";

export default function SearchPage() {
    const [category, setCategory]     = useState<Category>("food");
    const [keyword, setKeyword]       = useState<string>("");
    const [added, setAdded]           = useState<Place[]>([]);
    const [selected, setSelected]     = useState<Place | null>(null);
    const [mobileTab, setMobileTab]   = useState<MobileTab>("list"); // 모바일 탭 상태

    const { places, loading } = usePlaceSearch(category, keyword);

    const handleToggleAdd = (place: Place) => {
        setAdded((prev) =>
            prev.some((p) => p.id === place.id)
                ? prev.filter((p) => p.id !== place.id)
                : [...prev, place]
        );
    };

    const handleCategoryChange = (c: Category) => {
        setCategory(c);
        setKeyword("");
        setSelected(null);
    };

    // 모바일에서 장소 선택 시 자동으로 지도 탭으로 전환
    const handleSelect = (place: Place) => {
        setSelected(place);
        setMobileTab("map");
    };

    return (
        <div className="flex flex-col h-screen bg-white">

            <Navbar />

            {/* 모바일 탭 전환 버튼 */}
            <MobileTabBar
                mobileTab={mobileTab}
                addedCount={added.length}
                onChange={setMobileTab}
            />

            {/* 데스크탑: 좌우 분할 | 모바일: 탭으로 전환 */}
            <div className="flex flex-1 overflow-hidden">

                {/* 사이드패널 — 모바일: list 탭일 때만 표시 */}
                <div className={`
                    flex flex-col
                    w-full md:w-[300px] md:flex-shrink-0
                    border-r border-gray-100
                    overflow-hidden
                    ${mobileTab === "list" ? "flex" : "hidden"} md:flex
                `}>
                    <SidePanel
                        category={category}
                        keyword={keyword}
                        places={places}
                        loading={loading}
                        added={added}
                        onCategoryChange={handleCategoryChange}
                        onKeywordChange={setKeyword}
                        onToggleAdd={handleToggleAdd}
                        onSelect={handleSelect}
                    />
                </div>

                {/* 지도 영역 — 모바일: map 탭일 때만 표시 */}
                <div className={`
                    flex flex-col flex-1 overflow-hidden
                    ${mobileTab === "map" ? "flex" : "hidden"} md:flex
                `}>
                    <div className="flex-1">
                        <MapView places={places} selected={selected} />
                    </div>
                    <ScheduleBar added={added} />
                </div>

            </div>

        </div>
    );
}
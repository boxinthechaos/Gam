import { Search } from "lucide-react";

import type { SidePanelProps } from "../../types/SidePanelProps";

import CategoryTabs from "./CategoryTabs";
import ResultItem from "./ResultItem";

const CATEGORY_LABEL = { food: "식당", hotel: "숙소", tour: "관광지" };

export default function SidePanel({
    category, keyword, places, loading,
    added, onCategoryChange, onKeywordChange,
    onToggleAdd, onSelect,
}: SidePanelProps) {
    return (
        <div className="flex flex-col w-full h-full bg-white overflow-hidden">

            {/* 상단 고정 영역 */}
            <div className="p-3 pb-0">
                <CategoryTabs category={category} onChange={onCategoryChange} />

                <div className="
                    opacity-0 relative mb-2
                    animate-[appear_0.5s_ease-out_0.2s_forwards]"
                >
                    <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                    />
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => onKeywordChange(e.target.value)}
                        placeholder="지역명을 입력하세요"
                        className="
                            w-full pl-8 pr-3 py-2.5
                            border border-gray-200 rounded-xl
                            text-sm text-gray-700 bg-gray-50
                            outline-none
                            focus:border-[#ff8c00] focus:ring-2 focus:ring-orange-100
                            transition-all"
                    />
                </div>

                {keyword && (
                    <p className="text-xs text-gray-400 mb-2">
                        {CATEGORY_LABEL[category]} {places.length}곳
                    </p>
                )}
            </div>

            {/* 스크롤 결과 리스트 */}
            <div className="
                opacity-0 flex-1 overflow-y-auto
                px-3 pb-3
                animate-[appear_0.5s_ease-out_0.2s_forwards]"
            >
                {loading && (
                    <p className="text-xs text-gray-400 text-center mt-6">불러오는 중...</p>
                )}
                {!loading && keyword && places.length === 0 && (
                    <p className="text-xs text-gray-400 text-center mt-6">검색 결과가 없습니다.</p>
                )}
                {!loading && !keyword && (
                    <p className="text-xs text-gray-400 text-center mt-6">지역명을 입력해 검색하세요.</p>
                )}
                {places.map((place) => (
                    <ResultItem
                        key={place.id}
                        place={place}
                        isAdded={added.some((a) => a.id === place.id)}
                        onToggleAdd={onToggleAdd}
                        onSelect={onSelect}
                    />
                ))}
            </div>

        </div>
    );
}
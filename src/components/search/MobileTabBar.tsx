import { List, Map } from "lucide-react";

import type { MobileTabBarProps } from "../../types/MobileTabBarProps";

export default function MobileTabBar({ mobileTab, addedCount, onChange }: MobileTabBarProps) {
    return (
        // 모바일에서만 표시
        <div className="flex md:hidden border-b border-gray-100 bg-white flex-shrink-0">

            <button
                onClick={() => onChange("list")}
                className={`
                    flex-1 flex items-center justify-center gap-2
                    py-3 text-sm font-medium
                    border-b-2 transition-all cursor-pointer border-none bg-transparent
                    ${mobileTab === "list"
                        ? "border-[#ff8c00] text-[#ff8c00]"
                        : "border-transparent text-gray-400"
                    }
                `}
            >
                <List size={16} />
                장소 검색
            </button>

            <button
                onClick={() => onChange("map")}
                className={`
                    flex-1 flex items-center justify-center gap-2
                    py-3 text-sm font-medium
                    border-b-2 transition-all cursor-pointer border-none bg-transparent
                    ${mobileTab === "map"
                        ? "border-[#ff8c00] text-[#ff8c00]"
                        : "border-transparent text-gray-400"
                    }
                `}
            >
                <Map size={16} />
                지도 보기
                {addedCount > 0 && (
                    <span className="
                        inline-flex items-center justify-center
                        w-4 h-4 rounded-full
                        bg-[#ff8c00] text-white text-[10px] font-bold"
                    >
                        {addedCount}
                    </span>
                )}
            </button>

        </div>
    );
}
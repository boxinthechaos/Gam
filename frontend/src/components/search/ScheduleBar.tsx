import { useNavigate } from "react-router-dom";

import type { ScheduleBarProps } from "../../types/ScheduleBarProps";

export default function ScheduleBar({ added }: ScheduleBarProps) {
    const nav = useNavigate();

    return (
        <div className="
            opacity-0
            flex items-center justify-between shrink-0
            px-4 md:px-5 py-3
            border-t border-gray-100
            bg-white
            animate-[appear_0.5s_ease-out_0.4s_forwards]"
        >
            <p className="text-xs md:text-sm text-gray-500">
                일정에 추가된 장소{" "}
                <span className="text-[#ff8c00] font-medium">{added.length}곳</span>
            </p>

            <button
                onClick={() => nav("/my-page", { state: { places: added } })}
                disabled={added.length === 0}
                className={`
                    px-4 md:px-5 py-2
                    border-none rounded-full
                    text-xs md:text-sm font-medium
                    transition-all duration-150 cursor-pointer
                    ${added.length > 0
                        ? "bg-[#ff8c00] text-white hover:bg-[#e67e00]"
                        : "bg-gray-100 text-gray-300 cursor-not-allowed"
                    }
                `}
            >
                일정 만들기 →
            </button>
        </div>
    );
}
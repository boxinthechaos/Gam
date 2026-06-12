import { useState } from "react";
import { Calendar, List, Sparkles, Map } from "lucide-react";

import type { SidebarView, TripTab } from "../../types/MyPageTypes";

import NotionCalendar from "./NotionCalendar";
import PlaylistPanel from "./PlayListPanel";
import AIFeedbackModal from "./AiFeedBackModal";

import { useTripSchedules } from "../../hooks/useMyPageData";

interface Props { selected: SidebarView | null; }

export default function MainPanel({ selected }: Props) {
    const [tab, setTab]       = useState<TripTab>("calendar");
    const [aiOpen, setAiOpen] = useState(false);

    const tripId    = selected?.type === "trip" ? selected.data.id : null;
    const schedules = useTripSchedules(tripId);

    /* 빈 상태 */
    if (!selected) {
        return (
            <div className="
                flex flex-1 items-center justify-center 
                text-sm text-gray-300"
            >
                왼쪽에서 여행 또는 플레이리스트를 선택해주세요.
            </div>
        );
    }

    /* ── 플레이리스트 ── */
    if (selected.type === "playlist") {
        return (
            <div className="flex flex-col flex-1 overflow-hidden">

                <div className="px-6 py-5 border-b border-gray-100">

                    <h2 className="text-lg font-medium text-gray-900">
                        {selected.data.title}
                    </h2>

                    <p className="text-sm text-gray-400 mt-0.5">
                        {selected.data.songs.length}곡
                    </p>

                </div>

                <div className="flex-1 overflow-y-auto px-6 py-5">
                    <PlaylistPanel playlist={selected.data} />
                </div>

            </div>
        );
    }

    /* ── 여행 ── */
    const trip = selected.data;

    return (
        <>
            <div className="flex flex-col flex-1 overflow-hidden">

                {/* 헤더 */}
                <div className="px-6 pt-6 border-b border-gray-100">

                    <h2 className="text-lg font-medium text-gray-900 mb-1">
                        {trip.title}
                    </h2>

                    <p className="text-sm text-gray-400 mb-4">
                        {trip.startDate.replace(/-/g, ".")} ~ {trip.endDate.replace(/-/g, ".")}
                    </p>

                    {/* 탭 버튼 행 */}
                    <div className="flex items-center gap-2 mb-4">

                        {/* 캘린더 탭 */}
                        <button
                            onClick={() => setTab("calendar")}
                            className={`
                                flex items-center gap-1.5 
                                px-4 py-2 
                                border rounded-xl
                                text-sm font-medium 
                                transition-colors cursor-pointer

                                ${tab === "calendar"
                                    ? "border-[#ff8c00] bg-orange-50 text-[#ff8c00]"
                                    : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                                }
                            `}
                        >
                            <Calendar size={14} />
                            캘린더
                        </button>

                        {/* 목록 탭 */}
                        <button
                            onClick={() => setTab("list")}
                            className={`
                                flex items-center gap-1.5 
                                px-4 py-2 
                                border rounded-xl
                                text-sm font-medium 
                                transition-colors cursor-pointer

                                ${tab === "list"
                                    ? "border-[#ff8c00] bg-orange-50 text-[#ff8c00]"
                                    : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                                }
                            `}
                        >
                            <List size={14} />
                            목록
                        </button>

                        {/* 지도 버튼 (기능 미구현) */}
                        <button
                            disabled
                            className="
                                flex items-center gap-1.5 px-4 py-2 
                                border rounded-xl
                                border-gray-200 
                                bg-white
                                text-sm font-medium text-gray-300
                                cursor-not-allowed"
                            title="곧 지원 예정"
                        >
                            <Map size={14} />
                            지도
                        </button>

                        <div className="flex-1" />

                        {/* AI 일정 피드백 */}
                        <button
                            onClick={() => setAiOpen(true)}
                            className="
                                flex items-center gap-1.5 px-3.5 py-2 
                                border rounded-xl
                                border-gray-200 
                                bg-white
                                text-sm text-gray-500
                                transition-colors cursor-pointer

                                hover:border-[#ff8c00] 
                                hover:text-[#ff8c00] 
                                hover:bg-orange-50"
                        >
                            <Sparkles size={14} />
                            AI 일정 피드백
                        </button>

                    </div>

                </div>

                {/* 콘텐츠 */}
                <div className="flex-1 overflow-y-auto px-6 py-5">

                    {tab === "calendar" ? (
                        <NotionCalendar
                        schedules={schedules}
                        tripStart={trip.startDate}
                        tripEnd={trip.endDate}
                        />
                    ) : (
                        <div>

                            {schedules.length === 0 && (
                                <p className="text-sm text-gray-300 text-center py-10">
                                    등록된 일정이 없습니다.
                                </p>
                            )}

                            {schedules.map((s) => (
                                <div
                                    key={s.id}
                                    className="
                                        flex items-start gap-4 
                                        mb-2 px-4 py-3 
                                        border border-gray-100 rounded-xl
                                        transition-colors cursor-pointer

                                        hover:border-[#ff8c00]"
                                >

                                    <div className="shrink-0 w-20 pt-0.5 text-xs text-gray-400">
                                        {s.visitDate}
                                    </div>

                                    <div className="flex-1 min-w-0">

                                        <p className="text-sm font-medium text-gray-800">
                                            {s.placeName}
                                        </p>

                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {s.startTime}{s.endTime ? ` ~ ${s.endTime}` : ""}
                                        </p>

                                    </div>

                                    <span className="
                                        shrink-0
                                        px-2.5 py-1
                                        rounded-full
                                        bg-orange-50
                                        text-[11px] text-orange-600"
                                    >
                                        {s.category}
                                    </span>

                                </div>
                            ))}

                        </div>
                    )}

                </div>

            </div>

            {aiOpen && (
                <AIFeedbackModal 
                tripId={trip.id} 
                onClose={() => setAiOpen(false)} 
                />
            )}
        </>
    );
}
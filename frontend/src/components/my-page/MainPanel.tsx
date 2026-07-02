import { useState } from "react";
import { Calendar, List, Sparkles, Map, Plus } from "lucide-react";

import type { SidebarView, TripTab } from "../../types/MyPageTypes";

import NotionCalendar from "./NotionCalendar";
import PlaylistPanel from "./PlayListPanel";
import AIFeedbackModal from "./AiFeedBackModal";

import { useTripSchedules } from "../../hooks/useMyPageData";

interface Props {
    selected: SidebarView | null;
    onCreateTrip: () => void;   // 모바일 빈 상태에서 여행 만들기 버튼
}

export default function MainPanel({ selected, onCreateTrip }: Props) {
    const [tab, setTab] = useState<TripTab>("calendar");
    const [aiOpen, setAiOpen] = useState(false);

    const tripId = selected?.type === "trip" ? selected.data.id : null;
    const schedules = useTripSchedules(tripId);

    /* ── 빈 상태 ── */
    if (!selected) {
        return (
            <div className="flex flex-col flex-1 items-center justify-center gap-4 px-6">
                <p className="text-sm text-gray-400 text-center">
                    여행 또는 플레이리스트를 선택해주세요.
                </p>
                {/* 모바일: 여행 없을 때 만들기 버튼 */}
                <button
                    onClick={onCreateTrip}
                    className="
                        flex items-center gap-2
                        px-5 py-2.5 
                        border-none rounded-full 
                        bg-[#ff8c00] text-white
                        text-sm font-bold
                        cursor-pointer 
                        hover:bg-[#e67e00] transition-colors
                        
                        md:hidden"
                >
                    <Plus size={14} />
                    새 여행 만들기
                </button>
            </div>
        );
    }

    /* ── 플레이리스트 ── */
    if (selected.type === "playlist") {
        return (
            <div className="flex flex-col flex-1 overflow-hidden">
                <div className="px-4 py-4 border-gray-100 md:px-6 md:py-5 border-b">
                    <h2 className="text-base font-medium text-gray-900 md:text-lg">
                        {selected.data.title}
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {selected.data.songs.length}곡
                    </p>
                </div>
                <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-5">
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
                <div className="px-4 pt-4 border-b border-gray-100 md:px-6 md:pt-6">

                    <h2 className="text-base font-medium text-gray-900 mb-0.5 md:text-lg md:mb-1">
                        {trip.title}
                    </h2>
                    <p className="text-xs md:text-sm text-gray-400 mb-3 md:mb-4">
                        {trip.startDate.replace(/-/g, ".")} ~ {trip.endDate.replace(/-/g, ".")}
                    </p>

                    {/* 탭 버튼 행 */}
                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none md:gap-2 mb-3 md:mb-4">

                        {/* 캘린더 탭 */}
                        <button
                            onClick={() => setTab("calendar")}
                            className={`
                                flex items-center gap-1 shrink-0
                                px-3 py-1.5 
                                border rounded-xl 
                                text-xs font-medium
                                transition-colors cursor-pointer

                                md:gap-1.5
                                md:px-4
                                md:py-2
                                md:text-sm

                                ${tab === "calendar"
                                    ? "border-[#ff8c00] bg-orange-50 text-[#ff8c00]"
                                    : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                                }
                            `}
                        >
                            <Calendar size={13} />
                            캘린더
                        </button>

                        {/* 목록 탭 */}
                        <button
                            onClick={() => setTab("list")}
                            className={`
                                flex items-center gap-1 
                                px-3 py-1.5 
                                border rounded-xl shrink-0
                                text-xs font-medium
                                transition-colors cursor-pointer

                                md:gap-1.5
                                md:px-4
                                md:py-2
                                md:text-sm

                                ${tab === "list"
                                    ? "border-[#ff8c00] bg-orange-50 text-[#ff8c00]"
                                    : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                                }
                            `}
                        >
                            <List size={13} />
                            목록
                        </button>

                        {/* 지도 버튼 (기능 미구현) */}
                        <button
                            disabled
                            className="
                                flex items-center gap-1 
                                px-3  py-1.5 
                                border rounded-xl shrink-0
                                border-gray-200 bg-white
                                text-xs  font-medium text-gray-300
                                cursor-not-allowed
                                
                                md:gap-1.5
                                md:px-4
                                md:py-2
                                md:text-sm"
                            title="곧 지원 예정"
                        >
                            <Map size={13} />
                            지도
                        </button>

                        <div className="flex-1" />

                        {/* AI 일정 피드백 */}
                        <button
                            onClick={() => setAiOpen(true)}
                            className="
                                flex items-center gap-1 
                                px-2.5 py-1.5 
                                border rounded-xl shrink-0
                                border-gray-200 bg-white
                                text-xs text-gray-500
                                transition-colors cursor-pointer

                                hover:border-[#ff8c00] 
                                hover:text-[#ff8c00] 
                                hover:bg-orange-50
                                
                                md:gap-1.5
                                md:px-3.5
                                md:py-2
                                md:text-sm"
                        >
                            <Sparkles size={13} />

                            <span className="hidden sm:inline">
                                AI 일정 피드백
                            </span>

                            <span className="sm:hidden">
                                AI
                            </span>
                        </button>

                    </div>

                </div>

                {/* 콘텐츠 */}
                <div className="flex-1 overflow-y-auto px-3 py-4 md:px-6 md:py-5">
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
                                        flex items-start gap-3 
                                        mb-2 px-3 py-2.5  
                                        border border-gray-100 rounded-xl
                                        transition-colors cursor-pointer
                                        
                                        hover:border-[#ff8c00]
                                        
                                        md:gap-4
                                        md:px-4
                                        md:py-3"
                                >

                                    <div className="shrink-0 w-16 pt-0.5 text-xs text-gray-400 md:w-20">
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
                                        shrink-0 px-2 py-0.5  
                                        rounded-full bg-orange-50
                                        text-[10px] text-orange-600
                                        
                                        md:px-2.5
                                        md:py-1
                                        md:text-[11px]"
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
                <AIFeedbackModal tripId={trip.id} onClose={() => setAiOpen(false)} />
            )}
        </>
    );
}
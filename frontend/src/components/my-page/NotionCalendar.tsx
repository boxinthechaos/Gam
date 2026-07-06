import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { Schedule } from "../../types/MyPageTypes";
import type { NotionCalendarProps } from "../../types/NotionCalendarProps";
import type { DayModal } from "../../types/DayModal";

import ScheduleDayModal from "./ScheduleDayModal";

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

const CATEGORY_COLOR: Record<string, string> = {
    식당: "bg-orange-100 text-orange-700",
    숙소: "bg-blue-100 text-blue-700",
    관광지: "bg-emerald-100 text-emerald-700",
    카페: "bg-purple-100 text-purple-700",
    이동: "bg-slate-100 text-slate-600",
};

function fmtKey(y: number, m: number, d: number): string {
    return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export default function NotionCalendar({ schedules, tripStart, tripEnd, tripId, onEditSaved }: NotionCalendarProps) {
    const init = new Date(tripStart);
    const [cur, setCur] = useState({ year: init.getFullYear(), month: init.getMonth() });
    const [dayModal, setDayModal] = useState<DayModal | null>(null);

    const { year, month } = cur;
    const today = new Date();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDays = new Date(year, month, 0).getDate();
    const tripStart_ = new Date(tripStart);
    const tripEnd_ = new Date(tripEnd);

    const scheduleMap = schedules.reduce<Record<string, Schedule[]>>((acc, s) => {
        if (!acc[s.visitDate]) acc[s.visitDate] = [];
        acc[s.visitDate].push(s);
        return acc;
    }, {});

    const goMonth = (dir: number): void => {
        const d = new Date(year, month + dir, 1);
        setCur({ year: d.getFullYear(), month: d.getMonth() });
    };

    const leading  = Array.from({ length: firstDay }, (_, i) => prevDays - firstDay + i + 1);
    const trailing = Array.from(
        { length: (7 - ((firstDay + daysInMonth) % 7)) % 7 },
        (_, i) => i + 1
    );

    return (
        <>
            <div className="flex flex-col gap-3 md:gap-4">

                {/* 월 네비 */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 md:gap-2">
                        <button
                            onClick={() => goMonth(-1)}
                            className="
                                flex items-center justify-center
                                w-7 h-7
                                border border-gray-200 rounded-lg
                                bg-white text-gray-400
                                cursor-pointer transition-colors
                                hover:bg-gray-50"
                        >
                            <ChevronLeft size={14} />
                        </button>

                        <span className="min-w-19 text-sm font-medium text-gray-800 text-center">
                            {year}년 {month + 1}월
                        </span>

                        <button
                            onClick={() => goMonth(1)}
                            className="
                                flex items-center justify-center
                                w-7 h-7
                                border border-gray-200 rounded-lg
                                bg-white text-gray-400
                                cursor-pointer transition-colors
                                hover:bg-gray-50"
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>

                    <button
                        onClick={() => setCur({ year: today.getFullYear(), month: today.getMonth() })}
                        className="
                            text-xs px-3 py-1.5
                            border border-gray-200 rounded-xl
                            bg-white text-gray-500
                            cursor-pointer transition-colors
                            hover:bg-gray-50
                            md:text-sm md:px-4"
                    >
                        오늘
                    </button>
                </div>

                {/* 그리드 */}
                <div className="border border-gray-100 rounded-2xl overflow-hidden">

                    {/* 요일 헤더 */}
                    <div className="grid grid-cols-7 border-b border-gray-100">
                        {DAY_LABELS.map((d) => (
                            <div
                                key={d}
                                className="
                                    py-2 bg-gray-50
                                    text-center text-[10px] text-gray-400
                                    md:py-2.5 md:text-xs"
                            >
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* 날짜 셀 */}
                    <div className="grid grid-cols-7 divide-x divide-y divide-gray-100">

                        {/* 이전 달 */}
                        {leading.map((d) => (
                            <div key={`p-${d}`} className="min-h-14 bg-gray-50/60 md:min-h-22 p-1 md:p-2">
                                <span className="text-[10px] text-gray-300 md:text-xs">{d}</span>
                            </div>
                        ))}

                        {/* 현재 달 */}
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
                            const key = fmtKey(year, month, d);
                            const daySched = scheduleMap[key] ?? [];
                            const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
                            const cellDate = new Date(year, month, d);
                            const inTrip = cellDate >= tripStart_ && cellDate <= tripEnd_;

                            return (
                                <div
                                    key={d}
                                    onClick={() => setDayModal({ date: key, schedules: daySched })}
                                    className={`
                                        min-h-14 p-1
                                        cursor-pointer transition-colors
                                        hover:bg-orange-50
                                        md:min-h-22 md:p-2
                                        ${inTrip ? "bg-orange-50/50" : "bg-white"}
                                    `}
                                >
                                    <div className={`
                                        w-5 h-5
                                        flex items-center justify-center
                                        text-[10px] rounded-full mb-1
                                        md:w-6 md:h-6 md:text-xs md:mb-1.5
                                        ${isToday
                                            ? "bg-[#ff8c00] text-white font-medium"
                                            : "text-gray-500"
                                        }
                                    `}>
                                        {d}
                                    </div>

                                    {/* 모바일: 점 */}
                                    <div className="flex gap-0.5 flex-wrap md:hidden">
                                        {daySched.slice(0, 3).map((s) => (
                                            <div
                                                key={s.id}
                                                className={`
                                                    w-1.5 h-1.5 rounded-full shrink-0
                                                    ${s.category === "식당" ? "bg-orange-400" :
                                                      s.category === "관광지" ? "bg-emerald-400" :
                                                      s.category === "카페" ? "bg-purple-400" :
                                                      s.category === "숙소" ? "bg-blue-400" :
                                                      "bg-slate-400"}
                                                `}
                                            />
                                        ))}
                                    </div>

                                    {/* 데스크탑: 텍스트 칩 */}
                                    <div className="hidden md:block">
                                        {daySched.slice(0, 2).map((s) => (
                                            <div
                                                key={s.id}
                                                className={`
                                                    text-[10px] px-1.5 py-0.5 rounded
                                                    mb-0.5 truncate
                                                    ${CATEGORY_COLOR[s.category] ?? "bg-gray-100 text-gray-600"}
                                                `}
                                            >
                                                {s.placeName}
                                            </div>
                                        ))}
                                        {daySched.length > 2 && (
                                            <p className="text-[9px] text-gray-400 mt-0.5">
                                                +{daySched.length - 2}개 더
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* 다음 달 */}
                        {trailing.map((d) => (
                            <div key={`n-${d}`} className="min-h-14 bg-gray-50/60 md:min-h-22 p-1 md:p-2">
                                <span className="text-[10px] text-gray-300 md:text-xs">{d}</span>
                            </div>
                        ))}

                    </div>
                </div>
            </div>

            {/* 날짜 클릭 모달 */}
            {dayModal && (
                <ScheduleDayModal
                    tripId={tripId}
                    date={dayModal.date}
                    schedules={dayModal.schedules}
                    onClose={() => setDayModal(null)}
                    onEditSaved={onEditSaved}
                />
            )}
        </>
    );
}
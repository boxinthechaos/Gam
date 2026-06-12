import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { Schedule } from "../../types/MyPageTypes";
import type { NotionCalendarProps } from "../../types/NotionCalendarProps";

import ScheduleDayModal from "./ScheduleDayModal";

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

const CATEGORY_COLOR: Record<string, string> = {
    식당: "bg-orange-100 text-orange-700",
    숙소: "bg-blue-100 text-blue-700",
    관광지: "bg-emerald-100 text-emerald-700",
    카페: "bg-purple-100 text-purple-700",
    이동: "bg-slate-100 text-slate-600",
};

function fmtKey(y: number, m: number, d: number) {
    return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

interface DayModal { date: string; schedules: Schedule[]; }

export default function NotionCalendar({ schedules, tripStart, tripEnd }: NotionCalendarProps) {
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

    const goMonth = (dir: number) => {
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
            <div className="flex flex-col gap-4">

                {/* 월 네비 */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => goMonth(-1)}
                            className="
                                w-7 h-7 flex items-center justify-center
                                rounded-lg border border-gray-200 bg-white
                                text-gray-400 hover:bg-gray-50
                                cursor-pointer transition-colors"
                        >
                            <ChevronLeft size={14} />
                        </button>
                        <span className="text-sm font-medium text-gray-800 min-w-[80px] text-center">
                            {year}년 {month + 1}월
                        </span>
                        <button
                            onClick={() => goMonth(1)}
                            className="
                                w-7 h-7 flex items-center justify-center
                                rounded-lg border border-gray-200 bg-white
                                text-gray-400 hover:bg-gray-50
                                cursor-pointer transition-colors"
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                    <button
                        onClick={() => setCur({ year: today.getFullYear(), month: today.getMonth() })}
                        className="
                            text-sm px-4 py-1.5
                            border border-gray-200 rounded-xl bg-white
                            text-gray-500 hover:bg-gray-50
                            cursor-pointer transition-colors"
                    >
                        오늘
                    </button>
                </div>

                {/* 그리드 */}
                <div className="border border-gray-100 rounded-2xl overflow-hidden">

                    {/* 요일 헤더 */}
                    <div className="grid grid-cols-7 border-b border-gray-100">
                        {DAY_LABELS.map((d) => (
                            <div key={d} className="
                                py-2.5 text-center text-xs text-gray-400 bg-gray-50">
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* 날짜 셀 */}
                    <div className="grid grid-cols-7 divide-x divide-y divide-gray-100">

                        {/* 이전 달 */}
                        {leading.map((d) => (
                            <div key={`p-${d}`} className="min-h-[88px] p-2 bg-gray-50/60">
                                <span className="text-xs text-gray-300">{d}</span>
                            </div>
                        ))}

                        {/* 현재 달 */}
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
                            const key        = fmtKey(year, month, d);
                            const daySched   = scheduleMap[key] ?? [];
                            const isToday    = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
                            const cellDate   = new Date(year, month, d);
                            const inTrip     = cellDate >= tripStart_ && cellDate <= tripEnd_;

                            return (
                                <div
                                    key={d}
                                    onClick={() => setDayModal({ date: key, schedules: daySched })}
                                    className={`
                                        min-h-[88px] p-2 cursor-pointer transition-colors
                                        ${inTrip ? "bg-orange-50/50" : "bg-white"}
                                        hover:bg-orange-50
                                    `}
                                >
                                    {/* 날짜 숫자 */}
                                    <div className={`
                                        w-6 h-6 flex items-center justify-center
                                        text-xs rounded-full mb-1.5
                                        ${isToday
                                            ? "bg-[#ff8c00] text-white font-medium"
                                            : "text-gray-500"
                                        }
                                    `}>
                                        {d}
                                    </div>

                                    {/* 일정 칩 (최대 2개) */}
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
                            );
                        })}

                        {/* 다음 달 */}
                        {trailing.map((d) => (
                            <div key={`n-${d}`} className="min-h-[88px] p-2 bg-gray-50/60">
                                <span className="text-xs text-gray-300">{d}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 날짜 클릭 모달 */}
            {dayModal && (
                <ScheduleDayModal
                    date={dayModal.date}
                    schedules={dayModal.schedules}
                    onClose={() => setDayModal(null)}
                />
            )}
        </>
    );
}
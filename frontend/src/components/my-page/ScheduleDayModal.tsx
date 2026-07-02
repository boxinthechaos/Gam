import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Clock, CalendarDays, Pencil } from "lucide-react";

import type { Schedule } from "../../types/MyPageTypes";
import EditScheduleWindow from "../windows/EditScheduleWindow";
import AlertWindow from "../windows/AlertWindow";

interface Props {
    tripId: number;
    date: string;
    schedules: Schedule[];
    onClose: () => void;
    onEditSaved: () => void;  // 수정 성공 시 부모에서 refetch
}

const CATEGORY_STYLE: Record<string, string> = {
    식당: "bg-orange-100 text-orange-700",
    숙소: "bg-blue-100 text-blue-700",
    관광지: "bg-emerald-100 text-emerald-700",
    카페: "bg-purple-100 text-purple-700",
    이동: "bg-slate-100 text-slate-600",
};

function formatDateLabel(d: string) {
    const [y, m, day] = d.split("-");
    return `${Number(y)}년 ${Number(m)}월 ${Number(day)}일`;
}

export default function ScheduleDayModal({ tripId, date, schedules, onClose, onEditSaved }: Props) {
    const [editTarget, setEditTarget] = useState<Schedule | null>(null);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    const handleEditSaved = () => {
        onEditSaved();   // 부모에서 일정 목록 refetch
        onClose();       // 날짜 모달 닫기
    };

    return createPortal(
        <>
            <div
                className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
                onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            >
                <div className="
                    flex flex-col
                    w-full max-w-sm max-h-120 shadow-sm
                    border border-gray-100 rounded-2xl
                    bg-white overflow-hidden"
                >

                    {/* 헤더 */}
                    <div className="
                        flex items-center justify-between shrink-0
                        px-5 py-4
                        border-b border-gray-100"
                    >
                        <div className="flex items-center gap-2">
                            <CalendarDays size={15} className="text-[#ff8c00]" />
                            <span className="text-sm font-medium text-gray-900">
                                {formatDateLabel(date)}
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="
                                flex items-center justify-center
                                w-7 h-7
                                border-none rounded-lg bg-transparent
                                text-gray-400 hover:bg-gray-100
                                transition-colors cursor-pointer"
                            aria-label="닫기"
                        >
                            <X size={15} />
                        </button>
                    </div>

                    {/* 바디 */}
                    <div className="overflow-y-auto flex-1">
                        {schedules.length === 0 ? (
                            <p className="py-8 text-sm text-gray-400 text-center">
                                등록된 일정이 없습니다.
                            </p>
                        ) : (
                            schedules.map((s, i) => (
                                <div
                                    key={s.id}
                                    className={`
                                        flex items-start gap-4 px-5 py-4
                                        ${i < schedules.length - 1 ? "border-b border-gray-50" : ""}
                                    `}
                                >
                                    {/* 시간 */}
                                    <div className="flex flex-col gap-0.5 shrink-0 w-20 pt-0.5">
                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                            <Clock size={11} />
                                            {s.startTime}
                                        </div>
                                        {s.endTime && (
                                            <div className="text-xs text-gray-300 pl-3.5">
                                                ~ {s.endTime}
                                            </div>
                                        )}
                                    </div>

                                    {/* 정보 */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">
                                            {s.placeName}
                                        </p>
                                        <span className={`
                                            inline-block mt-1.5 px-2 py-0.5
                                            rounded-full text-[11px]
                                            ${CATEGORY_STYLE[s.category] ?? "bg-gray-100 text-gray-600"}
                                        `}>
                                            {s.category}
                                        </span>
                                    </div>

                                    {/* 수정 버튼 */}
                                    <button
                                        onClick={() => setEditTarget(s)}
                                        className="
                                            flex items-center justify-center shrink-0
                                            w-7 h-7
                                            border border-gray-200 rounded-lg bg-white
                                            text-gray-400
                                            hover:border-[#ff8c00] hover:text-[#ff8c00] hover:bg-orange-50
                                            transition-all cursor-pointer"
                                        aria-label="일정 수정"
                                    >
                                        <Pencil size={12} />
                                    </button>

                                </div>
                            ))
                        )}
                    </div>

                </div>
            </div>

            {/* 수정 윈도우 */}
            {editTarget && (
                <EditScheduleWindow
                    tripId={tripId}
                    schedule={editTarget}
                    onClose={() => setEditTarget(null)}
                    onSaved={handleEditSaved}
                    onError={(msg) => {
                        setEditTarget(null);
                        setAlertMessage(msg);
                    }}
                />
            )}

            {/* 에러 AlertWindow */}
            {alertMessage && (
                <AlertWindow
                    message={alertMessage}
                    onClose={() => setAlertMessage(null)}
                />
            )}
        </>,
        document.body
    );
}
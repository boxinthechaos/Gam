import { useState } from "react";
import { createPortal } from "react-dom";
import { X, CalendarDays } from "lucide-react";

import axios from "axios";

const CATEGORY_STYLE: Record<string, string> = {
    식당: "bg-orange-100 text-orange-700",
    숙소: "bg-blue-100 text-blue-700",
    관광지: "bg-emerald-100 text-emerald-700",
    카페: "bg-purple-100 text-purple-700",
    이동: "bg-slate-100 text-slate-600",
};

export default function EditScheduleWindow({ tripId, schedule, onClose, onSaved, onError }: EditScheduleWindowProps) {
    const [visitDate, setVisitDate] = useState(schedule.visitDate);
    const [startTime, setStartTime] = useState(schedule.startTime);
    const [endTime, setEndTime] = useState(schedule.endTime ?? "");
    const [isNextDay, setIsNextDay] = useState(schedule.isNextDay ?? false);
    const [saving, setSaving] = useState(false);

    const isValid =
        visitDate.length > 0 &&
        startTime.length > 0 &&
        endTime.length > 0 &&
        (isNextDay || startTime < endTime);

    const handleSave = async () => {
        if (!isValid) return;
        setSaving(true);

        try {
            await axios.put(
                `/api/v1/travel/trips/${tripId}/schedules/${schedule.id}`,
                {
                    placeName: schedule.placeName,
                    category: schedule.category,
                    visitDate,
                    startTime,
                    endTime,
                    isNextDay,
                },
                { withCredentials: true }
            );
            onSaved();
            onClose();
        } catch (e) {
            const msg =
                axios.isAxiosError(e) && e.response?.data?.message
                    ? e.response.data.message
                    : "일정 수정에 실패했습니다.";
            onClose();
            onError(msg);
        } finally {
            setSaving(false);
        }
    };

    return createPortal(
        <div
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="
                bg-white border border-gray-100 rounded-2xl
                w-full max-w-sm overflow-hidden flex flex-col"
            >

                {/* 헤더 */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <CalendarDays size={16} className="text-[#ff8c00]" />
                        <span className="text-sm font-bold text-gray-900">일정 수정</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="
                            w-7 h-7 flex items-center justify-center rounded-lg
                            border-none bg-transparent
                            text-gray-400 hover:bg-gray-100
                            transition-colors cursor-pointer"
                        aria-label="닫기"
                    >
                        <X size={15} />
                    </button>
                </div>

                {/* 바디 */}
                <div className="px-5 py-4">

                    {/* 장소 정보 (읽기 전용) */}
                    <div className="flex items-center justify-between px-3 py-2.5 bg-gray-50 rounded-xl mb-5">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {schedule.placeName}
                        </p>
                        <span className={`
                            shrink-0 ml-2 px-2 py-0.5
                            rounded-full text-[11px]
                            ${CATEGORY_STYLE[schedule.category] ?? "bg-gray-100 text-gray-600"}
                        `}>
                            {schedule.category}
                        </span>
                    </div>

                    {/* 날짜 */}
                    <div className="mb-4">
                        <label className="block text-xs text-gray-500 mb-1.5">방문 날짜</label>
                        <input
                            type="date"
                            value={visitDate}
                            onChange={(e) => setVisitDate(e.target.value)}
                            className="
                                w-full px-3 py-2.5
                                border border-gray-200 rounded-xl
                                text-sm text-gray-700 bg-gray-50
                                outline-none
                                focus:border-[#ff8c00] focus:ring-2 focus:ring-orange-100
                                transition-all"
                        />
                    </div>

                    {/* 시간 */}
                    <div className="mb-1">
                        <label className="block text-xs text-gray-500 mb-1.5">시간</label>
                        <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="
                                    w-full px-3 py-2.5
                                    border border-gray-200 rounded-xl
                                    text-sm text-gray-700 bg-gray-50
                                    outline-none
                                    focus:border-[#ff8c00] focus:ring-2 focus:ring-orange-100
                                    transition-all"
                            />
                            <span className="text-xs text-gray-300">~</span>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="
                                    w-full px-3 py-2.5
                                    border border-gray-200 rounded-xl
                                    text-sm text-gray-700 bg-gray-50
                                    outline-none
                                    focus:border-[#ff8c00] focus:ring-2 focus:ring-orange-100
                                    transition-all"
                            />
                        </div>

                        {startTime >= endTime && !isNextDay && (
                            <p className="text-xs text-red-400 mt-1.5">
                                종료 시간은 시작 시간보다 늦어야 합니다.
                            </p>
                        )}

                        <label className="flex items-center gap-2 mt-2.5 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={isNextDay}
                                onChange={(e) => setIsNextDay(e.target.checked)}
                                className="
                                    w-3.5 h-3.5 rounded
                                    border-gray-300 text-[#ff8c00]
                                    focus:ring-orange-200 cursor-pointer"
                            />
                            <span className="text-xs text-gray-500">다음 날 종료 (자정 이후)</span>
                        </label>
                    </div>

                </div>

                {/* 푸터 */}
                <div className="flex gap-2 px-5 pb-5">
                    <button
                        onClick={onClose}
                        className="
                            flex-1 py-2.5 rounded-xl
                            border border-gray-200 bg-gray-50
                            text-sm text-gray-500 font-medium
                            hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!isValid || saving}
                        className={`
                            flex-1 py-2.5 rounded-xl
                            border-none text-sm font-medium
                            transition-colors cursor-pointer
                            ${isValid && !saving
                                ? "bg-[#ff8c00] text-white hover:bg-[#e67e00]"
                                : "bg-gray-100 text-gray-300 cursor-not-allowed"
                            }
                        `}
                    >
                        {saving ? "수정 중..." : "수정 완료"}
                    </button>
                </div>

            </div>
        </div>,
        document.body
    );
}
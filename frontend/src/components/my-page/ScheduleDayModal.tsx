import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Clock, CalendarDays, Pencil, Navigation } from "lucide-react";

import type { Schedule } from "../../types/MyPageTypes";

import EditScheduleWindow from "../windows/EditScheduleWindow";
import AlertWindow from "../windows/AlertWindow";

type RouteStep = "from" | "to" | null;

interface Props {
    tripId: number;
    date: string;
    schedules: Schedule[];
    onClose: () => void;
    onEditSaved: () => void;
}

const CATEGORY_STYLE: Record<string, string> = {
    식당: "bg-orange-100 text-orange-700",
    숙소: "bg-blue-100 text-blue-700",
    관광지: "bg-emerald-100 text-emerald-700",
    카페:  "bg-purple-100 text-purple-700",
    이동: "bg-slate-100 text-slate-600",
};

function formatDateLabel(d: string): string {
    const [y, m, day] = d.split("-");
    return `${Number(y)}년 ${Number(m)}월 ${Number(day)}일`;
}

export default function ScheduleDayModal({ tripId, date, schedules, onClose, onEditSaved }: Props) {
    const [editTarget, setEditTarget] = useState<Schedule | null>(null);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    const [fromSchedule, setFromSchedule] = useState<Schedule | null>(null);
    const [toSchedule, setToSchedule] = useState<Schedule | null>(null);
    const [routeStep, setRouteStep] = useState<RouteStep>(null);

    const handleEditSaved = (): void => {
        onEditSaved();
        onClose();
    };

    const handleScheduleClick = (s: Schedule): void => {
        if (routeStep === "from") {
            setFromSchedule(s);
            setRouteStep("to");
        } else if (routeStep === "to") {
            if (s.id === fromSchedule?.id) return;
            setToSchedule(s);
            setRouteStep(null);
        }
    };

    const handleRouteMode = (): void => {
        setFromSchedule(null);
        setToSchedule(null);
        setRouteStep("from");
    };

    const handleCancelRoute = (): void => {
        setFromSchedule(null);
        setToSchedule(null);
        setRouteStep(null);
    };

    const handleOpenRoute = (): void => {
        if (!fromSchedule || !toSchedule) return;

        if (!fromSchedule.lat || !fromSchedule.lng || !toSchedule.lat || !toSchedule.lng) {
            setAlertMessage("좌표 정보가 없는 장소는 경로를 표시할 수 없습니다.");
            return;
        }

        const url = `https://map.kakao.com/link/from/${encodeURIComponent(fromSchedule.placeName)},${fromSchedule.lat},${fromSchedule.lng}/to/${encodeURIComponent(toSchedule.placeName)},${toSchedule.lat},${toSchedule.lng}`;
        window.open(url, "_blank");
    };

    const isRouteMode: boolean = routeStep !== null;
    const isRouteReady: boolean = !!fromSchedule && !!toSchedule;

    const getSelectionLabel = (s: Schedule): string | null => {
        if (fromSchedule?.id === s.id) return "출발";
        if (toSchedule?.id === s.id)   return "도착";
        return null;
    };

    return createPortal(
        <>
            <div
                className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
                onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            >
                <div className="
                    flex flex-col
                    w-full max-w-sm max-h-[80vh] shadow-sm
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
                        <div className="flex items-center gap-1.5">
                            {/* 경로 보기 토글 버튼 */}
                            {schedules.length >= 2 && (
                                <button
                                    onClick={isRouteMode ? handleCancelRoute : handleRouteMode}
                                    className={`
                                        flex items-center gap-1
                                        px-2.5 py-1.5
                                        border rounded-lg
                                        text-xs font-medium
                                        transition-all cursor-pointer
                                        ${isRouteMode
                                            ? "border-[#ff8c00] bg-orange-50 text-[#ff8c00]"
                                            : "border-gray-200 bg-white text-gray-400 hover:border-[#ff8c00] hover:text-[#ff8c00]"
                                        }
                                    `}
                                >
                                    <Navigation size={12} />
                                    {isRouteMode ? "취소" : "경로"}
                                </button>
                            )}
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
                    </div>

                    {/* 경로 선택 안내 배너 */}
                    {isRouteMode && (
                        <div className="
                            shrink-0 px-5 py-2.5
                            bg-orange-50 border-b border-orange-100
                            text-xs text-orange-600"
                        >
                            {routeStep === "from" && "출발 장소를 선택해주세요."}
                            {routeStep === "to"   && "도착 장소를 선택해주세요."}
                        </div>
                    )}

                    {/* 바디 */}
                    <div className="overflow-y-auto flex-1">
                        {schedules.length === 0 ? (
                            <p className="py-8 text-sm text-gray-400 text-center">
                                등록된 일정이 없습니다.
                            </p>
                        ) : (
                            schedules.map((s, i) => {
                                const selLabel = getSelectionLabel(s);
                                const isSelected = !!selLabel;
                                const isDisabled = isRouteMode && routeStep === "to" && s.id === fromSchedule?.id;

                                return (
                                    <div
                                        key={s.id}
                                        onClick={() => isRouteMode && !isDisabled && handleScheduleClick(s)}
                                        className={`
                                            flex items-start gap-4 px-5 py-4
                                            transition-colors
                                            ${i < schedules.length - 1 ? "border-b border-gray-50" : ""}
                                            ${isRouteMode && !isDisabled ? "cursor-pointer hover:bg-orange-50" : ""}
                                            ${isSelected ? "bg-orange-50" : ""}
                                            ${isDisabled ? "opacity-40 cursor-not-allowed" : ""}
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

                                        {/* 선택 뱃지 or 수정 버튼 */}
                                        {isRouteMode ? (
                                            selLabel && (
                                                <span className="
                                                    shrink-0 self-center
                                                    px-2 py-0.5
                                                    rounded-full
                                                    bg-[#ff8c00] text-white
                                                    text-[11px] font-medium"
                                                >
                                                    {selLabel}
                                                </span>
                                            )
                                        ) : (
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
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* 경로 보기 버튼 */}
                    {isRouteReady && (
                        <div className="shrink-0 px-5 pb-5 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                                <span className="
                                    px-2 py-0.5 rounded-full
                                    bg-[#ff8c00] text-white text-[11px] font-medium"
                                >
                                    출발
                                </span>
                                <span className="flex-1 truncate font-medium text-gray-700">
                                    {fromSchedule!.placeName}
                                </span>
                                <Navigation size={12} className="shrink-0 text-gray-300" />
                                <span className="
                                    px-2 py-0.5 rounded-full
                                    bg-[#ff8c00] text-white text-[11px] font-medium"
                                >
                                    도착
                                </span>
                                <span className="flex-1 truncate font-medium text-gray-700">
                                    {toSchedule!.placeName}
                                </span>
                            </div>
                            <button
                                onClick={handleOpenRoute}
                                className="
                                    w-full py-2.5
                                    border-none rounded-xl
                                    bg-[#ff8c00] text-white
                                    text-sm font-medium
                                    hover:bg-[#e67e00] transition-colors cursor-pointer"
                            >
                                카카오맵에서 경로 보기
                            </button>
                        </div>
                    )}

                </div>
            </div>

            {editTarget && (
                <EditScheduleWindow
                    tripId={tripId}
                    schedule={editTarget}
                    onClose={() => setEditTarget(null)}
                    onSaved={handleEditSaved}
                    onError={(msg: string) => {
                        setEditTarget(null);
                        setAlertMessage(msg);
                    }}
                />
            )}

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
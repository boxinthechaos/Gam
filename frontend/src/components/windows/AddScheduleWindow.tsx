import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { X, CalendarPlus, Utensils, Building2, Camera } from "lucide-react";
import axios from "axios";

import type { AddScheduleWindowProps } from "../../types/AddScheduleWindowProps";
import { useMyTrips } from "../../hooks/useMyTrips";
import { getTripDayOptions } from "../../types/TripDays";

const ICON_MAP = {
    food: { Icon: Utensils, bg: "bg-orange-100", color: "text-[#ff8c00]" },
    hotel: { Icon: Building2, bg: "bg-blue-100", color: "text-blue-500" },
    tour: { Icon: Camera, bg: "bg-emerald-100", color: "text-emerald-500" },
};

export default function AddScheduleWindow({ place, onClose, onSaved, onError }: AddScheduleWindowProps) {
    const { trips, loading: tripsLoading } = useMyTrips();

    const [tripId, setTripId] = useState<number | "">("");
    const [visitDate, setVisitDate] = useState<string>("");
    const [startTime, setStartTime] = useState<string>("10:00");
    const [endTime, setEndTime] = useState<string>("12:00");
    const [isNextDay, setIsNextDay] = useState<boolean>(false);
    const [saving, setSaving] = useState(false);

    const { Icon, bg, color } = ICON_MAP[place.category];

    const selectedTrip = trips.find((t) => t.id === tripId);
    const dayOptions = useMemo(
        () => (selectedTrip ? getTripDayOptions(selectedTrip.startDate, selectedTrip.endDate) : []),
        [selectedTrip]
    );

    const handleTripChange = (id: number) => {
        setTripId(id);
        setVisitDate("");
    };

    const isValid =
        tripId !== "" &&
        visitDate.length > 0 &&
        startTime.length > 0 &&
        endTime.length > 0 &&
        (isNextDay || startTime < endTime);

    const handleSave = async () => {
        if (!isValid) return;
        setSaving(true);

        try {
            await axios.post(
                `/api/v1/travel/trips/${tripId}/schedules`,
                {
                    placeName: place.name,
                    category:  place.category,
                    visitDate,
                    startTime,
                    endTime,
                    isNextDay,
                    lat: place.lat,
                    lng: place.lng,
                },
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" },
                }
            );

            onSaved?.();
            onClose();
        } catch (e) {
            const msg = "일정 추가에 실패했습니다.";

            // onError가 있으면 부모(AlertWindow)에 위임, 없으면 창 안에 인라인 표시
            if (onError) {
                onClose();
                onError(msg);
            }
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
                w-full max-w-sm overflow-hidden flex flex-col">

                {/* 헤더 */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <CalendarPlus size={16} className="text-[#ff8c00]" />
                        <span className="text-sm font-medium text-gray-900">일정 추가하기</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="
                            w-7 h-7 flex items-center justify-center rounded-lg
                            text-gray-400 hover:bg-gray-100
                            transition-colors cursor-pointer border-none bg-transparent"
                        aria-label="닫기"
                    >
                        <X size={15} />
                    </button>
                </div>

                {/* 바디 */}
                <div className="px-5 py-4">

                    {/* 선택한 장소 카드 */}
                    <div className="flex items-center gap-2.5 px-3 py-2.5 bg-gray-50 rounded-xl mb-5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>
                            <Icon size={15} className={color} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{place.name}</p>
                            <p className="text-xs text-gray-400 truncate">{place.address}</p>
                        </div>
                    </div>

                    {/* 여행 선택 */}
                    <div className="mb-4">
                        <label className="block text-xs text-gray-500 mb-1.5">
                            어느 여행에 추가할까요?
                        </label>
                        <select
                            value={tripId}
                            onChange={(e) => handleTripChange(Number(e.target.value))}
                            disabled={tripsLoading}
                            className="
                                w-full px-3 py-2.5
                                border border-gray-200 rounded-xl
                                text-sm text-gray-700 bg-gray-50
                                outline-none
                                focus:border-[#ff8c00] focus:ring-2 focus:ring-orange-100
                                transition-all"
                        >
                            <option value="" disabled>
                                {tripsLoading ? "여행 목록 불러오는 중..." : "여행을 선택해주세요"}
                            </option>
                            {trips.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.title} ({t.startDate.replace(/-/g, ".")} ~ {t.endDate.replace(/-/g, ".")})
                                </option>
                            ))}
                        </select>
                        {!tripsLoading && trips.length === 0 && (
                            <p className="text-xs text-gray-400 mt-1.5">
                                먼저 마이페이지에서 여행을 만들어주세요.
                            </p>
                        )}
                    </div>

                    {/* 날짜 선택 */}
                    <div className="mb-4">
                        <label className="block text-xs text-gray-500 mb-1.5">방문 날짜</label>
                        <select
                            value={visitDate}
                            onChange={(e) => setVisitDate(e.target.value)}
                            disabled={!selectedTrip}
                            className="
                                w-full px-3 py-2.5
                                border border-gray-200 rounded-xl
                                text-sm text-gray-700 bg-gray-50
                                outline-none
                                focus:border-[#ff8c00] focus:ring-2 focus:ring-orange-100
                                transition-all
                                disabled:text-gray-300 disabled:cursor-not-allowed"
                        >
                            <option value="" disabled>
                                {selectedTrip ? "날짜를 선택해주세요" : "먼저 여행을 선택해주세요"}
                            </option>
                            {dayOptions.map((d) => (
                                <option key={d.date} value={d.date}>
                                    {d.dayLabel} — {d.date.replace(/-/g, ".")}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 시간 선택 */}
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
                        {saving ? "추가 중..." : "일정에 추가"}
                    </button>
                </div>

            </div>
        </div>,
        document.body
    );
}
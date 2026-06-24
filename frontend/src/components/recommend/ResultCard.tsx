import { MapPin, RotateCcw, CalendarPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { RecommendResult } from "../../types/RecommendTypes";

interface Props {
    result: RecommendResult;
    onReset: () => void;
}

export default function ResultCard({ result, onReset }: Props) {
    const nav = useNavigate();

    return (
        <div className="
            border border-gray-100 rounded-2xl
            p-5 mt-5
            animate-[appear_0.4s_ease-out_forwards]"
        >
            {/* 장소명 */}
            <div className="flex items-center gap-3 mb-3">

                <div className="
                    flex items-center justify-center shrink-0
                    w-10 h-10 
                    rounded-full
                    bg-orange-50"
                >
                    <MapPin size={20} className="text-[#ff8c00]" />
                </div>

                <p className="text-lg font-medium text-gray-900">
                    {result.recommendedRegion}
                </p>

            </div>

            {/* 추천 이유 */}
            <p className="mb-4 text-sm text-gray-500 leading-relaxed ">
                {result.reason}
            </p>

            {/* 액션 버튼 */}
            <div className="flex gap-2">

                <button
                    onClick={onReset}
                    className="
                        flex-1 flex items-center justify-center gap-1.5
                        py-2.5 
                        border border-gray-200 bg-white rounded-xl
                        text-xs text-gray-500

                        hover:bg-gray-50 transition-colors cursor-pointer"
                >

                    <RotateCcw size={13} />
                    다시 선택하기

                </button>

                <button
                    onClick={() => nav("/travel/trip-create")}
                    className="
                        flex-1 flex items-center justify-center gap-1.5
                        py-2.5 
                        border-none bg-[#ff8c00] text-white rounded-xl
                        text-xs font-medium

                        hover:bg-[#e67e00] transition-colors cursor-pointer"
                >

                    <CalendarPlus size={13} />
                    일정 만들러 가기

                </button>

            </div>

        </div>
    );
}